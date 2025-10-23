import { useState, useRef, useCallback } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  progress: number;
  file: File;
  status: "pending" | "uploading" | "completed" | "error";
  errorMessage?: string;
  uploadUrl?: string;
}

export const useFileUpload = (config?: {
  endpoint?: string;
  timeout?: number;
  userId?: string;
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endpoint =
    config?.endpoint ||
    import.meta.env.VITE_UPLOAD_ENDPOINT ||
    "https://hw8hqfytqi.execute-api.eu-central-1.amazonaws.com/prod/files";
  const timeout = config?.timeout || 60000;
  const userId = config?.userId || "user123";

  const selectFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      progress: 0,
      file: file,
      status: "pending" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((fileData) => {
      uploadFile(fileData);
    });
  };

  const uploadFile = async (fileData: UploadedFile) => {
    // Update status to uploading
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileData.id
          ? { ...file, status: "uploading" as const }
          : file
      )
    );

    // Convert file to base64
    const convertToBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove data:type/subtype;base64, prefix
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const fileContent = await convertToBase64(fileData.file);

      const payload = {
        fileContent,
        fileName: fileData.name,
        contentType: fileData.file.type || "application/octet-stream",
        userId: userId,
      };

      const xhr = new XMLHttpRequest();

      return new Promise<void>((resolve, reject) => {
        // Track upload progress
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadedFiles((prev) =>
              prev.map((file) =>
                file.id === fileData.id ? { ...file, progress } : file
              )
            );
          }
        });

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log("Upload successful:", response);
              setUploadedFiles((prev) =>
                prev.map((file) =>
                  file.id === fileData.id
                    ? {
                        ...file,
                        progress: 100,
                        status: "completed" as const,
                        uploadUrl:
                          response.url ||
                          response.uploadUrl ||
                          response.downloadUrl,
                      }
                    : file
                )
              );
              resolve();
            } catch (error) {
              console.error(
                "Failed to parse server response:",
                xhr.responseText
              );
              setUploadedFiles((prev) =>
                prev.map((file) =>
                  file.id === fileData.id
                    ? {
                        ...file,
                        status: "error" as const,
                        errorMessage: "Invalid response from server",
                      }
                    : file
                )
              );
              reject(error);
            }
          } else {
            console.error(
              "Upload failed with status:",
              xhr.status,
              xhr.statusText,
              xhr.responseText
            );
            const errorMessage = `Upload failed: ${xhr.statusText} (${xhr.status})`;
            setUploadedFiles((prev) =>
              prev.map((file) =>
                file.id === fileData.id
                  ? {
                      ...file,
                      status: "error" as const,
                      errorMessage,
                    }
                  : file
              )
            );
            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = () => {
          const errorMessage = "Network error occurred during upload";
          setUploadedFiles((prev) =>
            prev.map((file) =>
              file.id === fileData.id
                ? {
                    ...file,
                    status: "error" as const,
                    errorMessage,
                  }
                : file
            )
          );
          reject(new Error(errorMessage));
        };

        xhr.ontimeout = () => {
          const errorMessage = "Upload timed out";
          setUploadedFiles((prev) =>
            prev.map((file) =>
              file.id === fileData.id
                ? {
                    ...file,
                    status: "error" as const,
                    errorMessage,
                  }
                : file
            )
          );
          reject(new Error(errorMessage));
        };

        xhr.timeout = timeout;
        xhr.open("POST", endpoint);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(payload));
      });
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileData.id
            ? {
                ...file,
                status: "error" as const,
                errorMessage: "Failed to process file",
              }
            : file
        )
      );
      throw error;
    }
  };

  const browseFiles = () => {
    fileInputRef.current?.click();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    selectFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      // Handle both relative and absolute URLs
      let fetchUrl: string;

      if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
        // Absolute URL - use URL constructor
        const url = new URL(endpoint);
        url.searchParams.append("userId", userId);
        fetchUrl = url.toString();
      } else {
        // Relative URL - construct manually
        const separator = endpoint.includes("?") ? "&" : "?";
        fetchUrl = `${endpoint}${separator}userId=${encodeURIComponent(userId)}`;
      }

      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch files: ${response.statusText} (${response.status})`
        );
      }

      const data = await response.json();
      console.log("Files fetched successfully:", data);

      // Convert server response to UploadedFile format
      const fetchedFiles: UploadedFile[] =
        data.files?.map(
          (file: {
            id?: string;
            fileName?: string;
            name?: string;
            url?: string;
            downloadUrl?: string;
            uploadUrl?: string;
          }) => ({
            id: file.id || Math.random().toString(36).substr(2, 9),
            name: file.fileName || file.name || "Unknown file",
            progress: 100, // Fetched files are already uploaded
            file: new File([""], file.fileName || file.name || "unknown"), // Create a placeholder File object
            status: "completed" as const,
            uploadUrl: file.url || file.downloadUrl || file.uploadUrl,
          })
        ) || [];

      setUploadedFiles(fetchedFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch files";
      setFetchError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, userId]);

  const deleteFile = async (fileId: string) => {
    // Update file status to show it's being deleted
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? { ...file, status: "uploading" as const } // Reuse uploading status to show activity
          : file
      )
    );

    try {
      // Handle both relative and absolute URLs for DELETE
      let deleteUrl: string;

      if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
        // Absolute URL - use URL constructor
        const url = new URL(`${endpoint}/${fileId}`);
        url.searchParams.append("userId", userId);
        deleteUrl = url.toString();
      } else {
        // Relative URL - construct manually
        deleteUrl = `${endpoint}/${fileId}?userId=${encodeURIComponent(userId)}`;
      }

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to delete file: ${response.statusText} (${response.status})`
        );
      }

      console.log("File deleted successfully:", fileId);

      // Remove file from local state
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);

      // Revert status back to completed on error
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                status: "error" as const,
                errorMessage:
                  error instanceof Error
                    ? error.message
                    : "Failed to delete file",
              }
            : file
        )
      );

      // Show error (you might want to add a toast notification here)
      setFetchError(
        error instanceof Error ? error.message : "Failed to delete file"
      );

      // Clear error after 5 seconds
      setTimeout(() => setFetchError(null), 5000);
    }
  };

  return {
    uploadedFiles,
    isLoading,
    fetchError,
    fileInputRef,
    selectFiles,
    browseFiles,
    onDrop,
    onDragOver,
    removeFile,
    fetchFiles,
    deleteFile,
  };
};
