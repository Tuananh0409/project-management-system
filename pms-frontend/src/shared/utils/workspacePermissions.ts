import type { AuthUser } from "@/features/auth/types";

/** Khớp logic backend: chỉ admin hệ thống tạo workspace. */
export function canCreateWorkspace(user: AuthUser | null | undefined): boolean {
  if (!user) return false;
  return (
    user.email.toLowerCase() === "admin@ctel.local" || user.id === 1
  );
}
