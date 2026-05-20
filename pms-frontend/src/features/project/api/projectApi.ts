import { apiFetch } from "@/shared/api/client";
import type { ProjectSummary } from "../types";

export const projectApi = {
  listByWorkspace: (workspaceId: number) =>
    apiFetch<ProjectSummary[]>(`/api/workspaces/${workspaceId}/projects`),
};
