import "./App.css";
import { useState, useRef } from "react";

interface UploadedFile {
  id: string;
  name: string;
  progress: number;
  file: File;
}

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
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

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  return (
    <div id="FileUpload">
      <div className="wrapper">
        <div className="upload" onDrop={handleDrop} onDragOver={handleDragOver}>
          <p>
            Drag files here or{" "}
            <span className="upload__button" onClick={handleBrowseClick}>
              Browse
            </span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFileSelect(e.target.files)}
            accept=".pdf,.doc,.docx,.txt,.jpg,.png"
          />
        </div>

        {uploadedFiles.map((file) => (
          <div key={file.id} className="uploaded">
            <i className="far fa-file-pdf"></i>
            <div className="file">
              <div className="file__name">
                <p>{file.name}</p>
                <i
                  className="fas fa-times"
                  onClick={() => removeFile(file.id)}
                ></i>
              </div>
              <div className="progress">
                <div
                  className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
