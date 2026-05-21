import { apiFetch } from "@/shared/api/client";
import type {
  AuthUser,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from "../types";

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiFetch<AuthUser>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      skipAuth: true,
    }),

  login: (payload: LoginPayload) =>
    apiFetch<AuthUser>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      skipAuth: true,
    }),

  logout: () =>
    apiFetch<void>("/api/auth/logout", {
      method: "POST",
    }),

  me: () => apiFetch<AuthUser>("/api/auth/me"),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiFetch<AuthUser>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  changePassword: (payload: ChangePasswordPayload) =>
    apiFetch<void>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
