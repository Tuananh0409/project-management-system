import { apiFetch } from "@/shared/api/client";
import type { AuthUser, LoginPayload, RegisterPayload } from "../types";

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiFetch<AuthUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      skipUserHeader: true,
    }),

  login: (payload: LoginPayload) =>
    apiFetch<AuthUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      skipUserHeader: true,
    }),
};
