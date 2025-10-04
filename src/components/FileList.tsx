import type { UploadedFile } from "../hooks/useFileUpload";
import { FileItem } from "./FileItem";

interface FileListProps {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export const FileList = ({ files, onRemoveFile }: FileListProps) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <>
      {files.map((file) => (
        <FileItem key={file.id} file={file} onRemove={onRemoveFile} />
      ))}
    </>
  );
};
