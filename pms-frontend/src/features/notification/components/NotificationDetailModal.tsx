import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import type { NotificationItem } from "../types";

type Props = {
  notification: NotificationItem;
  submitting?: boolean;
  onClose: () => void;
  onAcceptInvitation: (token: string) => void;
  onDeclineInvitation: (token: string) => void;
};

export function NotificationDetailModal({
  notification,
  submitting = false,
  onClose,
  onAcceptInvitation,
  onDeclineInvitation,
}: Props) {
  const invitation = notification.invitation;

  return (
    <Modal title="Chi tiết thông báo" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {notification.type}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{notification.title}</h3>
          <p className="mt-2 text-sm text-slate-700">{notification.message}</p>
          <p className="mt-2 text-xs text-slate-500">
            {new Date(notification.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>

        {notification.type === "WORKSPACE_INVITATION" && invitation && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm text-slate-700">
              <span className="font-medium">Workspace:</span> {invitation.workspaceName}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium">Người mời:</span> {invitation.inviterName}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium">Vai trò:</span> {invitation.roleName}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              <span className="font-medium">Hết hạn:</span>{" "}
              {new Date(invitation.expiredAt).toLocaleString("vi-VN")}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          {notification.type === "WORKSPACE_INVITATION" && invitation && (
            <>
              <Button
                variant="secondary"
                disabled={submitting}
                onClick={() => onDeclineInvitation(invitation.token)}
              >
                {submitting ? "Đang xử lý..." : "Từ chối"}
              </Button>
              <Button disabled={submitting} onClick={() => onAcceptInvitation(invitation.token)}>
                {submitting ? "Đang xử lý..." : "Chấp nhận"}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
