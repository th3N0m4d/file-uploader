import { useState, useRef } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  progress: number;
  file: File;
}

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      progress: 0,
      file: file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((fileData) => {
      simulateUpload(fileData.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? { ...file, progress: Math.min(file.progress + 10, 100) }
            : file
        )
      );
    }, 200);

    setTimeout(() => clearInterval(interval), 2000);
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
