import { useState, useRef } from "react";

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
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endpoint =
    config?.endpoint ||
    import.meta.env.VITE_UPLOAD_ENDPOINT ||
    "https://hw8hqfytqi.execute-api.eu-central-1.amazonaws.com/prod/files";
  const timeout = config?.timeout || 60000;

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
        userId: "user123", // You might want to make this dynamic
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

  return {
    uploadedFiles,
    fileInputRef,
    selectFiles,
    browseFiles,
    onDrop,
    onDragOver,
    removeFile,
  };
};
