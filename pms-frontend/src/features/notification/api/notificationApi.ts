import { apiFetch } from "@/shared/api/client";
import type { NotificationItem } from "../types";

export const notificationApi = {
  listMine: () => apiFetch<NotificationItem[]>("/api/notifications/mine"),
};
