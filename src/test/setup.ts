import { vi } from "vitest";
import "@testing-library/jest-dom";

Object.defineProperty(window, "File", {
  value: class File extends Blob {
    name: string;
    lastModified: number;

    constructor(
      chunks: BlobPart[],
      filename: string,
      options: FilePropertyBag = {}
    ) {
      super(chunks, options);
      this.name = filename;
      this.lastModified = options.lastModified || Date.now();
    }
  },
});

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
