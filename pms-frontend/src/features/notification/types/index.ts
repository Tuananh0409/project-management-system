export type NotificationType =
  | "WORKSPACE_INVITATION"
  | "TASK_COMMENT"
  | "TASK_DUE_SOON"
  | "SYSTEM";

export interface WorkspaceInvitationNotificationPayload {
  invitationId: number;
  workspaceId: number;
  workspaceName: string;
  inviterName: string;
  roleName: string;
  token: string;
  expiredAt: string;
}

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  actionable: boolean;
  actionStatus: string;
  invitation: WorkspaceInvitationNotificationPayload | null;
}
