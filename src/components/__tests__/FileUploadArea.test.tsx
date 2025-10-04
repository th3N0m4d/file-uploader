import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileUploadArea } from "../FileUploadArea";

describe("FileUploadArea", () => {
  const defaultProps = {
    onDrop: vi.fn(),
    onDragOver: vi.fn(),
    browseFiles: vi.fn(),
    selectFiles: vi.fn(),
    fileInputRef: { current: null },
  };

  it("should render upload area with correct text", () => {
    render(<FileUploadArea {...defaultProps} />);

    expect(screen.getByText("Drag files here or")).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
  });

  it("should call browseFiles when browse button is clicked", () => {
    const browseFiles = vi.fn();
    render(<FileUploadArea {...defaultProps} browseFiles={browseFiles} />);

    fireEvent.click(screen.getByText("Browse"));

    expect(browseFiles).toHaveBeenCalledTimes(1);
  });

  it("should call onDrop when files are dropped", () => {
    const onDrop = vi.fn();
    render(<FileUploadArea {...defaultProps} onDrop={onDrop} />);

    const uploadArea = screen.getByText("Drag files here or").parentElement;
    const mockEvent = new Event("drop", { bubbles: true });

    fireEvent(uploadArea!, mockEvent);

    expect(onDrop).toHaveBeenCalledTimes(1);
  });

  it("should call onDragOver when dragging over", () => {
    const onDragOver = vi.fn();
    render(<FileUploadArea {...defaultProps} onDragOver={onDragOver} />);

    const uploadArea = screen.getByText("Drag files here or").parentElement;
    const mockEvent = new Event("dragover", { bubbles: true });

    fireEvent(uploadArea!, mockEvent);

    expect(onDragOver).toHaveBeenCalledTimes(1);
  });

  it("should call selectFiles when files are selected via input", () => {
    const selectFiles = vi.fn();
    render(<FileUploadArea {...defaultProps} selectFiles={selectFiles} />);

    const fileInput = screen.getByRole("button", { hidden: true });
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    expect(selectFiles).toHaveBeenCalledTimes(1);
  });

  it("should render with custom accepted types", () => {
    render(<FileUploadArea {...defaultProps} acceptedTypes=".jpg,.png" />);

    const fileInput = screen.getByRole("button", {
      hidden: true,
    }) as HTMLInputElement;

    expect(fileInput.accept).toBe(".jpg,.png");
  });

  it("should render with default accepted types when not specified", () => {
    render(<FileUploadArea {...defaultProps} />);

    const fileInput = screen.getByRole("button", {
      hidden: true,
    }) as HTMLInputElement;

    expect(fileInput.accept).toBe(".pdf,.doc,.docx,.txt,.jpg,.png");
  });

  it("should have multiple attribute on file input", () => {
    render(<FileUploadArea {...defaultProps} />);

    const fileInput = screen.getByRole("button", {
      hidden: true,
    }) as HTMLInputElement;

    expect(fileInput.multiple).toBe(true);
  });

  it("should have hidden file input", () => {
    render(<FileUploadArea {...defaultProps} />);

    const fileInput = screen.getByRole("button", {
      hidden: true,
    }) as HTMLInputElement;

    expect(fileInput.style.display).toBe("none");
  });
});
