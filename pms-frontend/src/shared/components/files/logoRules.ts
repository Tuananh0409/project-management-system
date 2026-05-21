export const LOGO_ACCEPT = "image/png,image/jpeg,image/gif,image/webp";

export const LOGO_MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED = new Set(["png", "jpg", "jpeg", "gif", "webp"]);

export function validateLogoFile(file: File): string | null {
  if (file.size > LOGO_MAX_BYTES) {
    return "Logo tối đa 2MB";
  }
  const ext = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
    : "";
  if (!ALLOWED.has(ext)) {
    return "Chỉ hỗ trợ PNG, JPG, GIF hoặc WebP";
  }
  return null;
}
