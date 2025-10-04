import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useFileUpload } from "../useFileUpload";

describe("useFileUpload", () => {
  beforeEach(() => {
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should initialize with empty uploaded files", () => {
    const { result } = renderHook(() => useFileUpload());

    expect(result.current.uploadedFiles).toEqual([]);
    expect(result.current.fileInputRef.current).toBeNull();
  });

  it("should select files and add them to uploaded files", () => {
    const { result } = renderHook(() => useFileUpload());
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const mockFileList = [mockFile] as unknown as FileList;

    act(() => {
      result.current.selectFiles(mockFileList);
    });

    expect(result.current.uploadedFiles).toHaveLength(1);
    expect(result.current.uploadedFiles[0].name).toBe("test.pdf");
    expect(result.current.uploadedFiles[0].progress).toBe(0);
    expect(result.current.uploadedFiles[0].file).toBe(mockFile);
    expect(result.current.uploadedFiles[0].id).toBeDefined();
  });

  it("should handle null file list", () => {
    const { result } = renderHook(() => useFileUpload());

    act(() => {
      result.current.selectFiles(null);
    });

    expect(result.current.uploadedFiles).toEqual([]);
  });

  it("should simulate upload progress", () => {
    const { result } = renderHook(() => useFileUpload());
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const mockFileList = [mockFile] as unknown as FileList;

    act(() => {
      result.current.selectFiles(mockFileList);
    });

    const initialFile = result.current.uploadedFiles[0];
    expect(initialFile.progress).toBe(0);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.uploadedFiles[0].progress).toBe(10);

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(result.current.uploadedFiles[0].progress).toBe(100);
  });

  it("should remove file by id", () => {
    const { result } = renderHook(() => useFileUpload());
    const mockFile1 = new File(["content1"], "test1.pdf", {
      type: "application/pdf",
    });
    const mockFile2 = new File(["content2"], "test2.pdf", {
      type: "application/pdf",
    });
    const mockFileList = [mockFile1, mockFile2] as unknown as FileList;

    act(() => {
      result.current.selectFiles(mockFileList);
    });

    expect(result.current.uploadedFiles).toHaveLength(2);

    const fileIdToRemove = result.current.uploadedFiles[0].id;

    act(() => {
      result.current.removeFile(fileIdToRemove);
    });

    expect(result.current.uploadedFiles).toHaveLength(1);
    expect(result.current.uploadedFiles[0].name).toBe("test2.pdf");
  });

  it("should trigger file input click when browseFiles is called", () => {
    const { result } = renderHook(() => useFileUpload());
    const mockClick = vi.fn();

    result.current.fileInputRef.current = {
      click: mockClick,
    } as unknown as HTMLInputElement;

    act(() => {
      result.current.browseFiles();
    });

    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it("should handle drop event", () => {
    const { result } = renderHook(() => useFileUpload());
    const mockFile = new File(["content"], "test.pdf", {
      type: "application/pdf",
    });
    const mockEvent = {
      preventDefault: vi.fn(),
      dataTransfer: {
        files: [mockFile] as unknown as FileList,
      },
    } as unknown as React.DragEvent;

    act(() => {
      result.current.onDrop(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(result.current.uploadedFiles).toHaveLength(1);
    expect(result.current.uploadedFiles[0].name).toBe("test.pdf");
  });

  it("should handle drag over event", () => {
    const { result } = renderHook(() => useFileUpload());
    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.DragEvent;

    act(() => {
      result.current.onDragOver(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });
});
