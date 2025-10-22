import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { useFileUpload } from "../hooks/useFileUpload";

vi.mock("../hooks/useFileUpload", () => ({
  useFileUpload: vi.fn(() => ({
    uploadedFiles: [],
    isLoading: false,
    fetchError: null,
    fileInputRef: { current: null },
    selectFiles: vi.fn(),
    browseFiles: vi.fn(),
    onDrop: vi.fn(),
    onDragOver: vi.fn(),
    removeFile: vi.fn(),
    fetchFiles: vi.fn(),
    deleteFile: vi.fn(),
  })),
}));

// Helper function to render App with router
const renderWithRouter = (initialEntries = ["/upload"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

const defaultMockImplementation = () => ({
  uploadedFiles: [],
  isLoading: false,
  fetchError: null,
  fileInputRef: { current: null },
  selectFiles: vi.fn(),
  browseFiles: vi.fn(),
  onDrop: vi.fn(),
  onDragOver: vi.fn(),
  removeFile: vi.fn(),
  fetchFiles: vi.fn(),
  deleteFile: vi.fn(),
});

describe("App", () => {
  beforeEach(() => {
    vi.mocked(useFileUpload).mockImplementation(defaultMockImplementation);
  });

  it("should render the navigation", () => {
    renderWithRouter(["/upload"]);

    expect(screen.getByText("File Manager")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Upload Files")).toBeInTheDocument();
  });

  it("should render UploadPage on /upload route", () => {
    renderWithRouter(["/upload"]);

    expect(screen.getByText("Upload Files")).toBeInTheDocument();
    expect(screen.getByText("Drag files here or")).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
  });

  it("should render FileListPage on /files route", () => {
    const { getByRole } = renderWithRouter(["/files"]);

    expect(getByRole("heading", { name: "My Files" })).toBeInTheDocument();
  });

  it("should redirect from / to /upload", () => {
    renderWithRouter(["/"]);

    expect(screen.getByText("Upload Files")).toBeInTheDocument();
  });

  it("should handle file upload interaction on upload page", () => {
    const mockUseFileUpload = vi.fn(() => ({
      uploadedFiles: [
        {
          id: "test-1",
          name: "test.pdf",
          progress: 50,
          file: new File(["content"], "test.pdf", { type: "application/pdf" }),
          status: "uploading" as const,
        },
      ],
      isLoading: false,
      fetchError: null,
      fileInputRef: { current: null },
      selectFiles: vi.fn(),
      browseFiles: vi.fn(),
      onDrop: vi.fn(),
      onDragOver: vi.fn(),
      removeFile: vi.fn(),
      fetchFiles: vi.fn(),
      deleteFile: vi.fn(),
    }));

    vi.mocked(useFileUpload).mockImplementation(mockUseFileUpload);

    renderWithRouter(["/upload"]);

    expect(screen.getByText("Upload Files")).toBeInTheDocument();
  });

  it("should have correct component structure", () => {
    renderWithRouter(["/upload"]);

    const navbar = document.querySelector(".navbar");
    const uploadArea = document.querySelector(".upload");

    expect(navbar).toBeInTheDocument();
    expect(uploadArea).toBeInTheDocument();
  });

  it("should render without uploaded files initially on files page", () => {
    const { getByText } = renderWithRouter(["/files"]);

    expect(getByText("No files uploaded yet")).toBeInTheDocument();
  });
});
