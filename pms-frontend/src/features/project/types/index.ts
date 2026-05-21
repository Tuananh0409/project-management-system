export interface ProjectSummary {
  id: number;
  name: string;
  code: string;
  slug: string;
  colorCode: string | null;
  statusName: string | null;
  myRole: string | null;
  workspaceId: number;
}

export interface ProjectDetail {
  id: number;
  workspaceId: number;
  name: string;
  code: string;
  slug: string;
  description: string | null;
  statusName: string | null;
  statusColorCode: string | null;
  colorCode: string | null;
  privacyMode: string;
  startDate: string | null;
  endDate: string | null;
  projectLeadUserId: number | null;
  projectManagerUsername: string | null;
  myRole: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  projectLeadUserId?: number;
  startDate?: string;
  endDate?: string;
  colorCode?: string;
  privacyMode?: string;
  statusName?: string;
  code?: string;
  slug?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  projectLeadUserId?: number;
  startDate?: string;
  endDate?: string;
  colorCode?: string;
  privacyMode?: string;
  statusName?: string;
}

export interface ProjectMember {
  userId: number;
  username: string;
  email: string;
  roleName: string;
  joinedAt: string;
}

export interface AddProjectMemberPayload {
  userId: number;
  roleName: string;
}

export interface ProjectAttachment {
  id: number;
  projectId: number;
  fileName: string;
  fileType: string | null;
  fileSize: number;
  uploadedByUsername: string;
  createdAt: string;
  downloadUrl: string;
}
