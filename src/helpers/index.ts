// Helper function to get file icon class based on extension
export const getFileIcon = (fileName: string): string => {
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
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to get file icon URL for template-style icons
export const getFileIconUrl = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const iconBaseUrl =
    "https://coderthemes.com/highdmin/layouts/assets/images/file_icons/";

  switch (extension) {
    case "pdf":
      return `${iconBaseUrl}pdf.svg`;
    case "bmp":
      return `${iconBaseUrl}bmp.svg`;
    case "psd":
    case "ps":
      return `${iconBaseUrl}psd.svg`;
    case "avi":
      return `${iconBaseUrl}avi.svg`;
    case "cad":
      return `${iconBaseUrl}cad.svg`;
    case "txt":
      return `${iconBaseUrl}txt.svg`;
    case "eps":
      return `${iconBaseUrl}eps.svg`;
    case "dll":
      return `${iconBaseUrl}dll.svg`;
    case "sql":
      return `${iconBaseUrl}sql.svg`;
    case "zip":
      return `${iconBaseUrl}zip.svg`;
    case "png":
      return `${iconBaseUrl}png.svg`;
    case "jpg":
    case "jpeg":
      return `${iconBaseUrl}jpg.svg`;
    case "doc":
    case "docx":
      return `${iconBaseUrl}doc.svg`;
    default:
      return `${iconBaseUrl}txt.svg`;
  }
};
