export interface Workspace {
  id: number;
  name: string;
  description: string | null;
  code: string;
  slug: string;
  logoUrl: string | null;
  ownerId: number;
  ownerUsername: string;
  privacyMode: string;
  themeColor: string | null;
  status: string;
  timezone: string;
  myRole: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  userId: number;
  email: string;
  username: string;
  roleName: string;
  joinedAt: string;
}

export interface Invitation {
  id: number;
  workspaceId: number;
  workspaceName: string;
  email: string;
  roleName: string;
  status: string;
  token: string;
  expiredAt: string;
  createdAt: string;
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
  code?: string;
  slug?: string;
  /** URL https — logo workspace */
  logoUrl?: string;
  /** PRIVATE | ORG_WIDE */
  privacyMode?: string;
  /** #RGB | #RRGGBB */
  themeColor?: string;
  /** IANA timezone */
  timezone?: string;
}

export interface UpdateWorkspacePayload {
  name?: string;
  description?: string;
  logoUrl?: string;
  privacyMode?: string;
  themeColor?: string;
  status?: string;
  timezone?: string;
}

export interface InviteMemberPayload {
  email: string;
  roleName: string;
}
