import "./App.css";
import "./filemanager.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./components";
import { UploadPage, FileListPage } from "./pages";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" replace />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/files" element={<FileListPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
