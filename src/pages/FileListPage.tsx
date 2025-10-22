import { useEffect } from "react";
import { useFileUpload } from "../hooks/useFileUpload";
import { formatFileSize, getFileIcon } from "../helpers";

const BASE_API_URL = import.meta.env.VITE_UPLOAD_ENDPOINT;

export const FileListPage = () => {
  const { uploadedFiles, isLoading, fetchError, removeFile, fetchFiles } =
    useFileUpload({
      endpoint: BASE_API_URL,
      timeout: 6000,
      userId: "user123", // You can make this dynamic based on authentication
    });

  // Fetch existing files when component mounts
  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDownload = (file: any) => {
    const url = file.uploadUrl || file.url;
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleLoadMoreFiles = () => {
    // Placeholder for load more functionality
    console.log("Load more files clicked");
  };

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body gap-3">
                <div className="row">
                  <div className="col-lg-6 col-xl-6">
                    <h4 className="card-title m-b-30" role="heading">
                      My Files
                    </h4>
                  </div>
                </div>

                {fetchError && (
                  <div className="alert alert-danger" role="alert">
                    Error loading files: {fetchError}
                  </div>
                )}

                {isLoading ? (
                  <div className="text-center py-5">
                    <i className="fa fa-spinner fa-spin fa-3x text-muted"></i>
                    <p className="mt-3 text-muted">Loading files...</p>
                  </div>
                ) : uploadedFiles.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fa fa-folder-open fa-3x text-muted"></i>
                    <p className="mt-3 text-muted">No files uploaded yet</p>
                  </div>
                ) : (
                  <>
                    <div className="row">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="col-lg-3 col-xl-2">
                          <div className="file-man-box">
                            <a
                              href="#"
                              className="file-close"
                              onClick={(e) => {
                                e.preventDefault();
                                removeFile(file.id);
                              }}
                            >
                              <i className="fa fa-times-circle"></i>
                            </a>
                            <div className="file-img-box">
                              <i className={getFileIcon(file.name)}></i>
                            </div>
                            <a
                              href="#"
                              className="file-download"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDownload(file);
                              }}
                            >
                              <i className="fa fa-download"></i>
                            </a>
                            <div className="file-man-title">
                              <h5
                                className="mb-0 text-overflow"
                                title={file.name}
                              >
                                {file.name}
                              </h5>
                              <p className="mb-0">
                                <small>{formatFileSize(file.file.size)}</small>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {uploadedFiles.length >= 6 && (
                      <div className="text-center mt-3">
                        <button
                          type="button"
                          className="btn btn-outline-danger w-md waves-effect waves-light"
                          onClick={handleLoadMoreFiles}
                        >
                          <i className="mdi mdi-refresh"></i> Load More Files
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          {/* end col */}
        </div>
        {/* end row */}
      </div>
      {/* container */}
    </div>
  );
};
