import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import { useFileUpload } from "../hooks/useFileUpload";

vi.mock("../hooks/useFileUpload", () => ({
  useFileUpload: vi.fn(() => ({
    uploadedFiles: [],
    fileInputRef: { current: null },
    selectFiles: vi.fn(),
    browseFiles: vi.fn(),
    onDrop: vi.fn(),
    onDragOver: vi.fn(),
    removeFile: vi.fn(),
  })),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the main wrapper", () => {
    render(<App />);

    const wrapper = document.querySelector(".wrapper");
    expect(wrapper).toBeInTheDocument();
  });

  it("should render FileUploadArea component", () => {
    render(<App />);

    expect(screen.getByText("Drag files here or")).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
  });

  it("should render FileList component", () => {
    render(<App />);

    const fileListContainer = document.querySelector(".wrapper");
    expect(fileListContainer).toBeInTheDocument();
  });

  it.only("should handle file upload interaction", () => {
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
      fileInputRef: { current: null },
      selectFiles: vi.fn(),
      browseFiles: vi.fn(),
      onDrop: vi.fn(),
      onDragOver: vi.fn(),
      removeFile: vi.fn(),
    }));

    vi.mocked(useFileUpload).mockImplementation(mockUseFileUpload);

    render(<App />);

    expect(screen.getByText("test.pdf")).toBeInTheDocument();
  });

  it("should have correct component structure", () => {
    render(<App />);

    const wrapper = document.querySelector(".wrapper");
    const uploadArea = document.querySelector(".upload");

    expect(wrapper).toBeInTheDocument();
    expect(uploadArea).toBeInTheDocument();
  });

  it("should render without uploaded files initially", () => {
    render(<App />);

    const uploadedElements = document.querySelectorAll(".uploaded");
    expect(uploadedElements).toHaveLength(0);
  });
});
