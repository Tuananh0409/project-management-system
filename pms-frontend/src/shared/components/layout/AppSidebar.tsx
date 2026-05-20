import { NavLink } from "react-router-dom";
import { WorkspaceSidebarTree } from "@/features/workspace/components/WorkspaceSidebarTree";
import { MAIN_NAV } from "@/shared/config/navigation";
import { Badge } from "@/shared/components/ui/Badge";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-brand-600 text-white shadow-sm"
      : "text-slate-300 hover:bg-slate-800 hover:text-white",
  ].join(" ");
}

export function AppSidebar() {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-200">
      <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          PM
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">CTEL PM</p>
          <p className="truncate text-[11px] text-slate-400">Project Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {MAIN_NAV.slice(0, 1).map((section, si) => (
          <div key={si}>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavLink to={item.path} end={item.path === "/"} className={navClass}>
                    {item.icon}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={item.live ? "brand" : "muted"}
                        className={
                          item.live
                            ? ""
                            : "bg-slate-700/80 text-slate-400 group-[.active]:bg-white/20 group-[.active]:text-white"
                        }
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mt-6">
          <WorkspaceSidebarTree />
        </div>

        {MAIN_NAV.slice(1).map((section, si) => (
          <div key={section.title ?? si} className="mt-6">
            {section.title && (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <NavLink to={item.path} end={item.path === "/"} className={navClass}>
                    {item.icon}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={item.live ? "brand" : "muted"}
                        className={
                          item.live
                            ? ""
                            : "bg-slate-700/80 text-slate-400 group-[.active]:bg-white/20 group-[.active]:text-white"
                        }
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-3 text-[11px] text-slate-500">
        MVP · Workspace & Auth
      </div>
    </aside>
  );
}
