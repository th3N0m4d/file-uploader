import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileItem } from "../FileItem";
import type { UploadedFile } from "../../hooks/useFileUpload";

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

  const defaultProps = {
    file: mockFile,
    onRemove: vi.fn(),
  };

  it("should render file name", () => {
    render(<FileItem {...defaultProps} />);

    expect(screen.getByText("test-document.pdf")).toBeInTheDocument();
  });

  it("should render progress bar with correct width", () => {
    render(<FileItem {...defaultProps} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 75%");
  });

  it("should call onRemove when remove button is clicked", () => {
    const onRemove = vi.fn();
    render(<FileItem {...defaultProps} onRemove={onRemove} />);

    const removeButton = screen.getByRole("button");
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledWith("test-file-1");
  });

  it("should display PDF icon for PDF files", () => {
    render(<FileItem {...defaultProps} />);

    const icon = document.querySelector(".fa-file-pdf");
    expect(icon).toBeInTheDocument();
  });

  it("should display Word icon for Word documents", () => {
    const wordFile: UploadedFile = {
      ...mockFile,
      name: "document.docx",
      file: new File(["content"], "document.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
    };

    render(<FileItem {...defaultProps} file={wordFile} />);

    const icon = document.querySelector(".fa-file-word");
    expect(icon).toBeInTheDocument();
  });

  it("should display text icon for text files", () => {
    const textFile: UploadedFile = {
      ...mockFile,
      name: "notes.txt",
      file: new File(["content"], "notes.txt", { type: "text/plain" }),
    };

    render(<FileItem {...defaultProps} file={textFile} />);

    const icon = document.querySelector(".fa-file-alt");
    expect(icon).toBeInTheDocument();
  });

  it("should display image icon for image files", () => {
    const imageFile: UploadedFile = {
      ...mockFile,
      name: "photo.jpg",
      file: new File(["content"], "photo.jpg", { type: "image/jpeg" }),
    };

    render(<FileItem {...defaultProps} file={imageFile} />);

    const icon = document.querySelector(".fa-file-image");
    expect(icon).toBeInTheDocument();
  });

  it("should display generic icon for unknown file types", () => {
    const unknownFile: UploadedFile = {
      ...mockFile,
      name: "data.xyz",
      file: new File(["content"], "data.xyz", {
        type: "application/octet-stream",
      }),
    };

    render(<FileItem {...defaultProps} file={unknownFile} />);

    const icon = document.querySelector(".fa-file");
    expect(icon).toBeInTheDocument();
  });

  it("should render with 0% progress", () => {
    const zeroProgressFile: UploadedFile = {
      ...mockFile,
      progress: 0,
    };

    render(<FileItem {...defaultProps} file={zeroProgressFile} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 0%");
  });

  it("should render with 100% progress", () => {
    const completeFile: UploadedFile = {
      ...mockFile,
      progress: 100,
    };

    render(<FileItem {...defaultProps} file={completeFile} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle("width: 100%");
  });
});
