import type { AuthUser } from "@/features/auth/types";

const USER_ID_KEY = "pms-user-id";
const USER_EMAIL_KEY = "pms-user-email";
const USER_NAME_KEY = "pms-user-name";
const USER_STATUS_KEY = "pms-user-status";

/** JWT nằm trong httpOnly cookie — JS không đọc được (an toàn hơn localStorage). */
export function getUserId(): string {
  return localStorage.getItem(USER_ID_KEY) ?? "";
}

export function getStoredUser(): AuthUser | null {
  const id = localStorage.getItem(USER_ID_KEY);
  const email = localStorage.getItem(USER_EMAIL_KEY);
  const username = localStorage.getItem(USER_NAME_KEY);
  const status = localStorage.getItem(USER_STATUS_KEY) ?? "ACTIVE";
  if (!id || !email || !username) return null;
  return {
    id: Number(id),
    email,
    username,
    status,
  };
}

/** Lưu thông tin hiển thị; token do backend set qua Set-Cookie. */
export function persistSession(user: AuthUser) {
  localStorage.setItem(USER_ID_KEY, String(user.id));
  localStorage.setItem(USER_EMAIL_KEY, user.email);
  localStorage.setItem(USER_NAME_KEY, user.username);
  localStorage.setItem(USER_STATUS_KEY, user.status);
}

export function updateStoredUser(user: AuthUser) {
  localStorage.setItem(USER_ID_KEY, String(user.id));
  localStorage.setItem(USER_EMAIL_KEY, user.email);
  localStorage.setItem(USER_NAME_KEY, user.username);
  localStorage.setItem(USER_STATUS_KEY, user.status);
}

export function clearSession() {
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_STATUS_KEY);
}
