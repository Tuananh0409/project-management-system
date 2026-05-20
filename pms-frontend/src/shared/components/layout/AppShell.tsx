import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppTopBar } from "./AppTopBar";

/** Layout chính: sidebar trái + top bar + nội dung (kiểu Jira / ClickUp). */
export function AppShell() {
  return (
    <div data-app-shell className="flex h-screen overflow-hidden bg-slate-100">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-gradient-to-br from-slate-50 via-slate-100/90 to-slate-200/30">
        <AppTopBar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
