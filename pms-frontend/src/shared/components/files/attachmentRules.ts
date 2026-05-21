export const ATTACHMENT_MAX_BYTES = 20 * 1024 * 1024;

export const ATTACHMENT_ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "zip",
  "rar",
  "csv",
] as const;

export const ATTACHMENT_ACCEPT = ATTACHMENT_ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(",");

export function validateAttachmentFile(file: File): string | null {
  const dot = file.name.lastIndexOf(".");
  const ext = dot >= 0 ? file.name.slice(dot + 1).toLowerCase() : "";
  if (!ext || !ATTACHMENT_ALLOWED_EXTENSIONS.includes(ext as (typeof ATTACHMENT_ALLOWED_EXTENSIONS)[number])) {
    return `Định dạng «.${ext || "?"}» không được phép. Dùng PDF, Office, ảnh hoặc ZIP.`;
  }
  if (file.size > ATTACHMENT_MAX_BYTES) {
    return `«${file.name}» vượt quá 20MB.`;
  }
  return null;
}
