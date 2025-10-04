import type { RefObject } from "react";

interface Props {
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  browseFiles: () => void;
  selectFiles: (files: FileList | null) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
  acceptedTypes?: string;
}

export const FileUploadArea = ({
  onDrop,
  onDragOver,
  browseFiles,
  selectFiles,
  fileInputRef,
  acceptedTypes = ".pdf,.doc,.docx,.txt,.jpg,.png",
}: Props) => {
  return (
    <div className="upload" onDrop={onDrop} onDragOver={onDragOver}>
      <p>
        Drag files here or{" "}
        <span className="upload__button" onClick={browseFiles}>
          Browse
        </span>
      </p>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => selectFiles(e.target.files)}
        accept={acceptedTypes}
      />
    </div>
  );
};
