import type { UploadedFile } from "../hooks/useFileUpload";

interface Props {
  file: UploadedFile;
  onRemove: (fileId: string) => void;
}

const getFileIcon = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return "far fa-file-pdf";
    case "txt":
      return "far fa-file-alt";
    case "doc":
    case "docx":
      return "far fa-file-word";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "webp":
      return "far fa-file-image";
    default:
      return "far fa-file";
  }
};

export const FileItem = ({ file, onRemove }: Props) => {
  return (
    <div key={file.id} className="uploaded">
      <i className={getFileIcon(file.name)}></i>
      <div className="file">
        <div className="file__name">
          <p>{file.name}</p>
          <i
            className="fas fa-times"
            onClick={() => onRemove(file.id)}
            role="button"
          ></i>
        </div>
        <div className="progress">
          <div
            className="progress-bar bg-success progress-bar-striped progress-bar-animated"
            style={{ width: `${file.progress}%` }}
            role="progressbar"
          ></div>
        </div>
      </div>
    </div>
  );
};
