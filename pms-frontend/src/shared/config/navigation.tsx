import type { ReactNode } from "react";

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: ReactNode;
  /** true = đã có API backend */
  live?: boolean;
  badge?: string;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center [&>svg]:h-5 [&>svg]:w-5">
      {children}
    </span>
  );
}

const ic = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  ),
  tasks: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  workspace: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  board: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
    </svg>
  ),
  milestone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export const MAIN_NAV: NavSection[] = [
  {
    items: [
      {
        id: "dashboard",
        label: "Tổng quan",
        path: "/",
        icon: <Icon>{ic.home}</Icon>,
        live: true,
      },
      {
        id: "my-tasks",
        label: "Công việc của tôi",
        path: "/my-tasks",
        icon: <Icon>{ic.tasks}</Icon>,
        badge: "Sắp có",
      },
    ],
  },
  {
    title: "Công cụ",
    items: [
      {
        id: "board",
        label: "Bảng Kanban",
        path: "/board",
        icon: <Icon>{ic.board}</Icon>,
        badge: "Sắp có",
      },
      {
        id: "milestones",
        label: "Milestone",
        path: "/milestones",
        icon: <Icon>{ic.milestone}</Icon>,
        badge: "Sắp có",
      },
    ],
  },
  {
    title: "Báo cáo & Hệ thống",
    items: [
      {
        id: "reports",
        label: "Báo cáo",
        path: "/reports",
        icon: <Icon>{ic.chart}</Icon>,
        badge: "Sắp có",
      },
      {
        id: "members",
        label: "Thành viên",
        path: "/members",
        icon: <Icon>{ic.users}</Icon>,
        badge: "Sắp có",
      },
      {
        id: "settings",
        label: "Cài đặt",
        path: "/settings",
        icon: <Icon>{ic.settings}</Icon>,
        badge: "Sắp có",
      },
    ],
  },
];
