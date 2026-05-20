import { apiFetch } from "@/shared/api/client";
import type { Invitation, Workspace } from "../types";

export const invitationApi = {
  listMine: () => apiFetch<Invitation[]>("/api/invitations/mine"),

  accept: (token: string) =>
    apiFetch<Workspace>(`/api/invitations/${token}/accept`, { method: "POST" }),

  decline: (token: string) =>
    apiFetch<void>(`/api/invitations/${token}/decline`, { method: "POST" }),
};
