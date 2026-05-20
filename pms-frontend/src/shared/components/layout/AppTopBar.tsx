import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "@/features/notification/api/notificationApi";
import { NotificationDetailModal } from "@/features/notification/components/NotificationDetailModal";
import type { NotificationItem } from "@/features/notification/types";
import { invitationApi } from "@/features/workspace/api/invitationApi";
import { ApiClientError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/Button";
import { useAuth } from "@/shared/context/AuthContext";
import { notifyWorkspacesChanged } from "@/shared/events/appEvents";

export function AppTopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(
    null,
  );
  const [submittingAction, setSubmittingAction] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  async function loadNotifications() {
    setLoadingNotifications(true);
    try {
      const list = await notificationApi.listMine();
      setNotifications(list);
    } catch {
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }

  async function handleAcceptInvitation(token: string) {
    setSubmittingAction(true);
    try {
      const ws = await invitationApi.accept(token);
      await loadNotifications();
      setSelectedNotification(null);
      notifyWorkspacesChanged({ workspaceId: ws.id });
      navigate(`/workspaces/${ws.id}`);
    } catch (err) {
      window.alert(
        err instanceof ApiClientError ? err.message : "Không thể chấp nhận lời mời",
      );
    } finally {
      setSubmittingAction(false);
    }
  }

  async function handleDeclineInvitation(token: string) {
    setSubmittingAction(true);
    try {
      await invitationApi.decline(token);
      await loadNotifications();
      setSelectedNotification(null);
    } catch (err) {
      window.alert(
        err instanceof ApiClientError ? err.message : "Không thể từ chối lời mời",
      );
    } finally {
      setSubmittingAction(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const initials = user?.username
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative hidden max-w-md flex-1 sm:block">
          <input
            type="search"
            disabled
            placeholder="Tìm task, dự án... (sắp có)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-400"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            ⌕
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" className="hidden sm:inline-flex" disabled>
          + Tạo nhanh
        </Button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotificationPanel((prev) => !prev)}
            className="relative rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50"
            title="Thông báo"
          >
            <span aria-hidden>🔔</span>
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-600 px-1 text-[10px] font-semibold text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotificationPanel && (
            <div className="absolute right-0 z-20 mt-2 w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
              <p className="mb-2 text-sm font-semibold text-slate-900">Thông báo hoạt động</p>
              {loadingNotifications ? (
                <p className="text-sm text-slate-500">Đang tải...</p>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-slate-500">Hiện chưa có thông báo nào.</p>
              ) : (
                <ul className="space-y-2">
                  {notifications.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedNotification(item)}
                        className="w-full rounded-lg border border-slate-200 p-2.5 text-left transition hover:bg-slate-50"
                      >
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.message}</p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          {new Date(item.createdAt).toLocaleString("vi-VN")}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
            title={user?.email}
          >
            {initials}
          </div>
          <div className="hidden min-w-0 md:block">
            <p className="truncate text-sm font-medium text-slate-900">{user?.username}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <Button type="button" variant="secondary" onClick={handleLogout}>
            Thoát
          </Button>
        </div>
      </div>
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          submitting={submittingAction}
          onClose={() => setSelectedNotification(null)}
          onAcceptInvitation={handleAcceptInvitation}
          onDeclineInvitation={handleDeclineInvitation}
        />
      )}
    </header>
  );
}
