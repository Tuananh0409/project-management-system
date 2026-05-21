import { NavLink } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";
import { WorkspaceSidebarTree } from "@/features/workspace/components/WorkspaceSidebarTree";
import { MAIN_NAV } from "@/shared/config/navigation";
import { Badge } from "@/shared/components/ui/Badge";
import {
  mainNavClass,
  SIDEBAR_SECTION_LABEL,
  SIDEBAR_SHELL,
} from "./sidebarStyles";

export function AppSidebar() {
  return (
    <aside className={SIDEBAR_SHELL}>
      <div className="flex h-14 items-center gap-3 border-b border-slate-100 px-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm shadow-brand-600/25">
          <LayoutTemplate className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
            CTEL PM
          </p>
          <p className="truncate text-[11px] text-slate-500">Project Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3">
        {MAIN_NAV.slice(0, 1).map((section, si) => (
          <div key={si}>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavLink to={item.path} end={item.path === "/"} className={mainNavClass}>
                    {item.icon}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant={item.live ? "brand" : "muted"}>{item.badge}</Badge>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mt-4 border-t border-slate-100 pt-4">
          <WorkspaceSidebarTree />
        </div>

        {MAIN_NAV.slice(1).map((section, si) => (
          <div key={section.title ?? si} className="mt-5">
            {section.title && (
              <p className={`mb-1.5 ${SIDEBAR_SECTION_LABEL}`}>{section.title}</p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavLink to={item.path} end={item.path === "/"} className={mainNavClass}>
                    {item.icon}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <Badge variant={item.live ? "brand" : "muted"}>{item.badge}</Badge>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400">
        MVP · Workspace &amp; Project
      </div>
    </aside>
  );
}
