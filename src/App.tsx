import "./App.css";
import { useEffect } from "react";
import { useFileUpload } from "./hooks/useFileUpload";
import { FileUploadArea, FileList } from "./components";

const BASE_API_URL = import.meta.env.VITE_UPLOAD_ENDPOINT;

function App() {
  const {
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
  } = useFileUpload({
    endpoint: BASE_API_URL,
    timeout: 6000,
    userId: "user123", // You can make this dynamic based on authentication
  });

  // Fetch existing files when component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="wrapper">
      {fetchError && (
        <div
          className="error-message"
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            borderRadius: "4px",
            color: "#c66",
          }}
        >
          Error loading files: {fetchError}
        </div>
      )}

      {isLoading && (
        <div
          className="loading-message"
          style={{
            padding: "10px",
            marginBottom: "20px",
            backgroundColor: "#e6f3ff",
            border: "1px solid #b3d9ff",
            borderRadius: "4px",
            color: "#0066cc",
          }}
        >
          Loading files...
        </div>
      )}

      <FileUploadArea
        onDrop={onDrop}
        onDragOver={onDragOver}
        browseFiles={browseFiles}
        selectFiles={selectFiles}
        fileInputRef={fileInputRef}
      />
      <FileList files={uploadedFiles} onRemoveFile={removeFile} />
    </div>
  );
}

export default App;
