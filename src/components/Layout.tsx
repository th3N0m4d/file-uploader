import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="fa fa-cloud-upload me-2"></i>
            File Manager
          </Link>

          <div className="navbar-nav ms-auto">
            <Link
              className={`nav-link ${location.pathname === "/upload" ? "active" : ""}`}
              to="/upload"
            >
              <i className="fa fa-upload me-1"></i>
              Upload
            </Link>
            <Link
              className={`nav-link ${location.pathname === "/files" ? "active" : ""}`}
              to="/files"
            >
              <i className="fa fa-list me-1"></i>
              My Files
            </Link>
          </div>
        </div>
      </nav>

      <main className="py-4">{children}</main>
    </div>
  );
};
