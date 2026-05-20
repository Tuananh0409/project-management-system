/** Giá trị gửi API — chuẩn SaaS cho workspace / team space. */
export const WORKSPACE_PRIVACY_OPTIONS = [
  {
    value: "PRIVATE",
    label: "Riêng tư",
    hint: "Chỉ người được mời mới truy cập (mặc định, giống Jira/Asana private team).",
  },
  {
    value: "ORG_WIDE",
    label: "Nội bộ tổ chức",
    hint: "Hiện trong danh sách workspace công ty; phù hợp phòng ban công khai nội bộ.",
  },
] as const;

/** Múi giờ IANA thường dùng (khu vực VN + ASEAN). */
export const COMMON_TIMEZONES = [
  "Asia/Ho_Chi_Minh",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Jakarta",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
] as const;

/** Bảng màu nhận diện workspace (kiểu ClickUp / Monday). */
export const WORKSPACE_COLOR_PRESETS = [
  "#2563EB",
  "#7C3AED",
  "#DB2777",
  "#DC2626",
  "#EA580C",
  "#CA8A04",
  "#16A34A",
  "#0D9488",
  "#0891B2",
  "#4F46E5",
  "#64748B",
] as const;
