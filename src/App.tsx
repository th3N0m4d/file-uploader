import "./App.css";
import { useFileUpload } from "./hooks/useFileUpload";
import { FileUploadArea, FileList } from "./components";

const BASE_API_URL = import.meta.env.VITE_UPLOAD_ENDPOINT;

function App() {
  const {
    uploadedFiles,
    fileInputRef,
    selectFiles,
    browseFiles,
    onDrop,
    onDragOver,
    removeFile,
  } = useFileUpload({ endpoint: BASE_API_URL, timeout: 6000 });

  return (
    <div className="wrapper">
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
