import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components";
import { UploadPage, FileListPage } from "./pages";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/files" element={<FileListPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
