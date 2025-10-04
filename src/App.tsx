import "./App.css";
import { useFileUpload } from "./hooks/useFileUpload";
import { FileUploadArea, FileList } from "./components";

function App() {
  const {
    uploadedFiles,
    fileInputRef,
    selectFiles,
    browseFiles,
    onDrop,
    onDragOver,
    removeFile,
  } = useFileUpload();

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
