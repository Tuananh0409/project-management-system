import { apiFetch, apiUpload } from "@/shared/api/client";
import type {
  AddProjectMemberPayload,
  CreateProjectPayload,
  ProjectAttachment,
  ProjectDetail,
  ProjectMember,
  ProjectSummary,
  UpdateProjectPayload,
} from "../types";

function projectBase(workspaceSlug: string, projectSlug?: string) {
  const ws = `/api/workspaces/${encodeURIComponent(workspaceSlug)}/projects`;
  return projectSlug ? `${ws}/${encodeURIComponent(projectSlug)}` : ws;
}

export const projectApi = {
  listByWorkspace: (workspaceSlug: string) =>
    apiFetch<ProjectSummary[]>(projectBase(workspaceSlug)),

  get: (workspaceSlug: string, projectSlug: string) =>
    apiFetch<ProjectDetail>(projectBase(workspaceSlug, projectSlug)),

  create: (workspaceSlug: string, body: CreateProjectPayload) =>
    apiFetch<ProjectDetail>(projectBase(workspaceSlug), {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (workspaceSlug: string, projectSlug: string, body: UpdateProjectPayload) =>
    apiFetch<ProjectDetail>(projectBase(workspaceSlug, projectSlug), {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (workspaceSlug: string, projectSlug: string) =>
    apiFetch<void>(projectBase(workspaceSlug, projectSlug), {
      method: "DELETE",
    }),

  listMembers: (workspaceSlug: string, projectSlug: string) =>
    apiFetch<ProjectMember[]>(`${projectBase(workspaceSlug, projectSlug)}/members`),

  addMember: (
    workspaceSlug: string,
    projectSlug: string,
    body: AddProjectMemberPayload,
  ) =>
    apiFetch<ProjectMember>(`${projectBase(workspaceSlug, projectSlug)}/members`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateMemberRole: (
    workspaceSlug: string,
    projectSlug: string,
    userId: number,
    roleName: string,
  ) =>
    apiFetch<ProjectMember>(
      `${projectBase(workspaceSlug, projectSlug)}/members/${userId}/role`,
      { method: "PATCH", body: JSON.stringify({ roleName }) },
    ),

  removeMember: (workspaceSlug: string, projectSlug: string, userId: number) =>
    apiFetch<void>(`${projectBase(workspaceSlug, projectSlug)}/members/${userId}`, {
      method: "DELETE",
    }),

  listAttachments: (workspaceSlug: string, projectSlug: string) =>
    apiFetch<ProjectAttachment[]>(
      `${projectBase(workspaceSlug, projectSlug)}/attachments`,
    ),

  uploadAttachment: (workspaceSlug: string, projectSlug: string, file: File) =>
    apiUpload<ProjectAttachment>(
      `${projectBase(workspaceSlug, projectSlug)}/attachments`,
      file,
    ),

  deleteAttachment: (
    workspaceSlug: string,
    projectSlug: string,
    attachmentId: number,
  ) =>
    apiFetch<void>(
      `${projectBase(workspaceSlug, projectSlug)}/attachments/${attachmentId}`,
      { method: "DELETE" },
    ),
};
