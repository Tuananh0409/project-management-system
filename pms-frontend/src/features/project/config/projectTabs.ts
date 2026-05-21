import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  FileText,
  FormInput,
  GanttChart,
  Kanban,
  LayoutList,
  LayoutDashboard,
  ListTodo,
} from "lucide-react";

export type ProjectTabId =
  | "summary"
  | "list"
  | "board"
  | "calendar"
  | "timeline"
  | "docs"
  | "forms"
  | "backlog";

export type ProjectTabDef = {
  id: ProjectTabId;
  label: string;
  icon: LucideIcon;
  /** false = hiển thị badge "Sắp có" */
  available: boolean;
};

export const PROJECT_TABS: ProjectTabDef[] = [
  { id: "summary", label: "Tổng quan", icon: LayoutDashboard, available: true },
  { id: "list", label: "Danh sách", icon: LayoutList, available: false },
  { id: "board", label: "Bảng", icon: Kanban, available: true },
  { id: "calendar", label: "Lịch", icon: Calendar, available: false },
  { id: "timeline", label: "Timeline", icon: GanttChart, available: false },
  { id: "docs", label: "Tài liệu", icon: FileText, available: false },
  { id: "forms", label: "Form", icon: FormInput, available: false },
  { id: "backlog", label: "Backlog", icon: ListTodo, available: true },
];

export const DEFAULT_PROJECT_TAB: ProjectTabId = "backlog";

export function parseProjectTab(value: string | null): ProjectTabId {
  const found = PROJECT_TABS.find((t) => t.id === value);
  if (found?.available) return found.id;
  if (value === "summary" || value === "board" || value === "backlog") return value;
  return DEFAULT_PROJECT_TAB;
}
