import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileItem } from "../FileItem";
import type { UploadedFile } from "../../hooks/useFileUpload";

// Mock the helpers module
vi.mock("../../helpers", () => ({
  getFileIcon: vi.fn((fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "far fa-file-pdf";
      case "txt":
        return "far fa-file-alt";
      case "doc":
      case "docx":
        return "far fa-file-word";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "webp":
        return "far fa-file-image";
      default:
        return "far fa-file";
    }
  }),
}));

describe("FileItem", () => {
  const mockFile: UploadedFile = {
    id: "test-file-1",
    name: "test-document.pdf",
    progress: 75,
    file: new File(["content"], "test-document.pdf", {
      type: "application/pdf",
    }),
    status: "uploading" as const,
  };

  it("should render file name", () => {
    render(<FileItem file={mockFile} />);

    expect(screen.getByText("test-document.pdf")).toBeInTheDocument();
  });

  it("should render progress bar with correct width", () => {
    render(<FileItem file={mockFile} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 75%");
  });

  it("should display PDF icon for PDF files", () => {
    render(<FileItem file={mockFile} />);

    const icon = document.querySelector(".fa-file-pdf");
    expect(icon).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    render(<FileItem file={mockFile} />);

    const uploadedElement = document.querySelector(".uploaded");
    expect(uploadedElement).toBeInTheDocument();

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveClass(
      "progress-bar",
      "bg-success",
      "progress-bar-striped",
      "progress-bar-animated"
    );
  });

  it("should display different icons for different file types", () => {
    const txtFile = {
      ...mockFile,
      name: "document.txt",
    };

    render(<FileItem file={txtFile} />);

    const icon = document.querySelector(".fa-file-alt");
    expect(icon).toBeInTheDocument();
  });

  it("should handle file with 0% progress", () => {
    const fileWith0Progress = {
      ...mockFile,
      progress: 0,
    };

    render(<FileItem file={fileWith0Progress} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 0%");
  });

  it("should handle file with 100% progress", () => {
    const fileWith100Progress = {
      ...mockFile,
      progress: 100,
    };

    render(<FileItem file={fileWith100Progress} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 100%");
  });
});
