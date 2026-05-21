import type { ApiErrorBody } from "./types";
import { clearSession } from "./session";

export { getUserId, getStoredUser, persistSession, updateStoredUser, clearSession } from "./session";

export class ApiClientError extends Error {
  code: string;
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message ?? "Đã xảy ra lỗi");
    this.code = body.code;
    this.status = status;
    this.fieldErrors = body.fieldErrors;
  }
}

async function parseError(res: Response): Promise<ApiClientError> {
  let body: ApiErrorBody = { code: "UNKNOWN", message: res.statusText };
  try {
    body = await res.json();
  } catch {
    /* empty */
  }
  return new ApiClientError(res.status, body);
}

function handleUnauthorized(path: string) {
  const isAuthRoute = path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register");
  if (isAuthRoute) return;
  clearSession();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.assign("/login");
  }
}

export type ApiFetchOptions = RequestInit & {
  /** Đăng ký / đăng nhập — không cần cookie phiên cũ. */
  skipAuth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { skipAuth, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  if (fetchOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(path, {
      ...fetchOptions,
      headers,
      credentials: skipAuth ? "same-origin" : "include",
    });
  } catch {
    throw new ApiClientError(0, {
      code: "NETWORK_ERROR",
      message:
        "Không kết nối được backend. Hãy chạy Docker (Postgres) và backend trên cổng 8080.",
    });
  }

  if (res.status === 401) {
    handleUnauthorized(path);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  return res.json() as Promise<T>;
}

/** Upload multipart/form-data (không set Content-Type — browser tự thêm boundary). */
export async function apiUpload<T>(path: string, file: File, fieldName = "file"): Promise<T> {
  const form = new FormData();
  form.append(fieldName, file);

  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      body: form,
      credentials: "include",
    });
  } catch {
    throw new ApiClientError(0, {
      code: "NETWORK_ERROR",
      message:
        "Không kết nối được backend. Hãy chạy Docker (Postgres) và backend trên cổng 8080.",
    });
  }

  if (res.status === 401) {
    handleUnauthorized(path);
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  return res.json() as Promise<T>;
}
