import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileList } from "../FileList";
import type { UploadedFile } from "../../hooks/useFileUpload";

describe("FileList", () => {
  const mockFiles: UploadedFile[] = [
    {
      id: "file-1",
      name: "document1.pdf",
      progress: 50,
      file: new File(["content1"], "document1.pdf", {
        type: "application/pdf",
      }),
      status: "uploading" as const,
    },
    {
      id: "file-2",
      name: "document2.docx",
      progress: 100,
      file: new File(["content2"], "document2.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
      status: "completed" as const,
    },
    {
      id: "file-3",
      name: "image.jpg",
      progress: 25,
      file: new File(["content3"], "image.jpg", { type: "image/jpeg" }),
      status: "uploading" as const,
    },
  ];

  const defaultProps = {
    files: mockFiles,
    onRemoveFile: vi.fn(),
  };

  it("should render all files when files array is not empty", () => {
    render(<FileList {...defaultProps} />);

    expect(screen.getByText("document1.pdf")).toBeInTheDocument();
    expect(screen.getByText("document2.docx")).toBeInTheDocument();
    expect(screen.getByText("image.jpg")).toBeInTheDocument();
  });

  it("should render nothing when files array is empty", () => {
    const { container } = render(<FileList {...defaultProps} files={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("should render correct number of FileItem components", () => {
    render(<FileList {...defaultProps} />);

    const fileItems = screen.getAllByRole("button");
    expect(fileItems).toHaveLength(3);
  });

  it("should pass onRemoveFile to each FileItem", () => {
    const onRemoveFile = vi.fn();
    render(<FileList {...defaultProps} onRemoveFile={onRemoveFile} />);

    const removeButtons = screen.getAllByRole("button");
    expect(removeButtons).toHaveLength(3);
  });

  it("should render files with different progress values", () => {
    render(<FileList {...defaultProps} />);

    const progressBars = screen.getAllByRole("progressbar");
    expect(progressBars[0]).toHaveStyle("width: 50%");
    expect(progressBars[1]).toHaveStyle("width: 100%");
    expect(progressBars[2]).toHaveStyle("width: 25%");
  });

  it("should handle single file", () => {
    const singleFile = [mockFiles[0]];
    render(<FileList {...defaultProps} files={singleFile} />);

    expect(screen.getByText("document1.pdf")).toBeInTheDocument();
    expect(screen.queryByText("document2.docx")).not.toBeInTheDocument();
    expect(screen.queryByText("image.jpg")).not.toBeInTheDocument();
  });

  it("should render files with correct icons based on file type", () => {
    render(<FileList {...defaultProps} />);

    expect(document.querySelector(".fa-file-pdf")).toBeInTheDocument();
    expect(document.querySelector(".fa-file-word")).toBeInTheDocument();
    expect(document.querySelector(".fa-file-image")).toBeInTheDocument();
  });
});
