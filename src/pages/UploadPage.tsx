import { useFileUpload } from "../hooks/useFileUpload";
import { FileUploadArea, FileList } from "../components";

const BASE_API_URL = import.meta.env.VITE_UPLOAD_ENDPOINT;

export const UploadPage = () => {
  const {
    fileInputRef,
    uploadedFiles,
    selectFiles,
    browseFiles,
    onDrop,
    onDragOver,
  } = useFileUpload({
    endpoint: BASE_API_URL,
    timeout: 6000,
    userId: "user123", // You can make this dynamic based on authentication
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Upload Files</h4>

              <FileUploadArea
                onDrop={onDrop}
                onDragOver={onDragOver}
                browseFiles={browseFiles}
                selectFiles={selectFiles}
                fileInputRef={fileInputRef}
              />

              <FileList files={uploadedFiles} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
