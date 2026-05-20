import { apiFetch } from "@/shared/api/client";
import type {
  CreateWorkspacePayload,
  InviteMemberPayload,
  Invitation,
  Member,
  UpdateWorkspacePayload,
  Workspace,
} from "../types";

export const workspaceApi = {
  list: () => apiFetch<Workspace[]>("/api/workspaces"),

  get: (id: number) => apiFetch<Workspace>(`/api/workspaces/${id}`),

  create: (payload: CreateWorkspacePayload) =>
    apiFetch<Workspace>("/api/workspaces", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpdateWorkspacePayload) =>
    apiFetch<Workspace>(`/api/workspaces/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  delete: (id: number, confirmName: string) =>
    apiFetch<void>(`/api/workspaces/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ confirmName }),
    }),

  listMembers: (id: number) =>
    apiFetch<Member[]>(`/api/workspaces/${id}/members`),

  listInvitations: (id: number) =>
    apiFetch<Invitation[]>(`/api/workspaces/${id}/invitations`),

  invite: (id: number, payload: InviteMemberPayload) =>
    apiFetch<Invitation>(`/api/workspaces/${id}/invitations`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateMemberRole: (workspaceId: number, userId: number, roleName: string) =>
    apiFetch<Member>(`/api/workspaces/${workspaceId}/members/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ roleName }),
    }),

  removeMember: (workspaceId: number, userId: number) =>
    apiFetch<void>(`/api/workspaces/${workspaceId}/members/${userId}`, {
      method: "DELETE",
    }),

  leave: (id: number) =>
    apiFetch<void>(`/api/workspaces/${id}/leave`, { method: "POST" }),
};
