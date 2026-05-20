import type { ApiErrorBody } from "./types";
import { getUserId } from "./session";

export { getUserId, getStoredUser, persistSession, clearSession } from "./session";

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

export type ApiFetchOptions = RequestInit & {
  /** Không gửi X-User-Id (đăng ký / đăng nhập). */
  skipUserHeader?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { skipUserHeader, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);
  const userId = getUserId();
  if (!skipUserHeader && userId) {
    headers.set("X-User-Id", userId);
  }
  if (fetchOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(path, { ...fetchOptions, headers });
  } catch {
    throw new ApiClientError(0, {
      code: "NETWORK_ERROR",
      message:
        "Không kết nối được backend. Hãy chạy Docker (Postgres) và backend trên cổng 8080.",
    });
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  return res.json() as Promise<T>;
}
