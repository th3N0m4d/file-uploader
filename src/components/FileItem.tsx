import type { UploadedFile } from "../hooks/useFileUpload";
import { getFileIcon } from "../helpers";

interface Props {
  file: UploadedFile;
}

export const FileItem = ({ file }: Props) => {
  return (
    <div key={file.id} className="uploaded">
      <i className={getFileIcon(file.name)}></i>
      <div className="file">
        <div className="file__name">
          <p>{file.name}</p>
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
