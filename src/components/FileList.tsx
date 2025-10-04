import type { UploadedFile } from "../hooks/useFileUpload";
import { FileItem } from "./FileItem";

interface Props {
  files: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
}

export const FileList = ({ files, onRemoveFile }: Props) => {
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
