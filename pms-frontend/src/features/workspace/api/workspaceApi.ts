import { apiFetch, apiUpload } from "@/shared/api/client";
import type {
  CreateWorkspacePayload,
  InviteMemberPayload,
  Invitation,
  Member,
  UpdateWorkspacePayload,
  Workspace,
} from "../types";

function wsBase(slug: string) {
  return `/api/workspaces/${encodeURIComponent(slug)}`;
}

export const workspaceApi = {
  list: () => apiFetch<Workspace[]>("/api/workspaces"),

  get: (slug: string) => apiFetch<Workspace>(wsBase(slug)),

  create: (payload: CreateWorkspacePayload) =>
    apiFetch<Workspace>("/api/workspaces", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (slug: string, payload: UpdateWorkspacePayload) =>
    apiFetch<Workspace>(wsBase(slug), {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  delete: (slug: string, confirmName: string) =>
    apiFetch<void>(wsBase(slug), {
      method: "DELETE",
      body: JSON.stringify({ confirmName }),
    }),

  listMembers: (slug: string) => apiFetch<Member[]>(`${wsBase(slug)}/members`),

  listInvitations: (slug: string) => apiFetch<Invitation[]>(`${wsBase(slug)}/invitations`),

  invite: (slug: string, payload: InviteMemberPayload) =>
    apiFetch<Invitation>(`${wsBase(slug)}/invitations`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMemberRole: (slug: string, userId: number, roleName: string) =>
    apiFetch<Member>(`${wsBase(slug)}/members/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ roleName }),
    }),

  removeMember: (slug: string, userId: number) =>
    apiFetch<void>(`${wsBase(slug)}/members/${userId}`, {
      method: "DELETE",
    }),

  leave: (slug: string) => apiFetch<void>(`${wsBase(slug)}/leave`, { method: "POST" }),

  uploadLogo: (slug: string, file: File) =>
    apiUpload<Workspace>(`${wsBase(slug)}/logo`, file),

  deleteLogo: (slug: string) =>
    apiFetch<void>(`${wsBase(slug)}/logo`, { method: "DELETE" }),
};
