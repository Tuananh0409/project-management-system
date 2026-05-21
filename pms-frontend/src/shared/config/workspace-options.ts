/** Giá trị gửi API — PRIVATE | ORG_WIDE (hiển thị: Private | Public). */
export const WORKSPACE_PRIVACY_OPTIONS = [
  {
    value: "PRIVATE",
    label: "Private",
    hint: "Chỉ thành viên được mời mới truy cập phòng ban / dự án.",
  },
  {
    value: "ORG_WIDE",
    label: "Public",
    hint: "Hiển thị trong danh sách công ty; phù hợp phòng ban mọi người trong org đều thấy.",
  },
] as const;

export function getPrivacyModeLabel(value: string | null | undefined): string {
  const found = WORKSPACE_PRIVACY_OPTIONS.find(
    (o) => o.value === (value ?? "").toUpperCase(),
  );
  return found?.label ?? value ?? "Private";
}

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
