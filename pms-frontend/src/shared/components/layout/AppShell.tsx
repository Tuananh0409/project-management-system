import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/shared/components/feedback/ErrorBoundary";
import { AppSidebar } from "./AppSidebar";
import { AppTopBar } from "./AppTopBar";

const PROJECT_SHELL_PATTERN = /^\/workspaces\/[^/]+\/projects\/[^/]+/;

/** Layout chính: sidebar trái + top bar + nội dung (kiểu Jira / ClickUp). */
export function AppShell() {
  const { pathname } = useLocation();
  const isProjectShell = PROJECT_SHELL_PATTERN.test(pathname);

  return (
    <div data-app-shell className="flex h-screen overflow-hidden bg-[#f6f7f9]">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-[#f6f7f9]">
        <AppTopBar />
        <main
          className={[
            "flex-1 overflow-y-auto",
            isProjectShell ? "p-0" : "p-6 md:p-8",
          ].join(" ")}
        >
          <div className={isProjectShell ? "h-full w-full" : "mx-auto max-w-7xl"}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
