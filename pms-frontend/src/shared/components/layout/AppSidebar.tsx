import { NavLink } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";
import { WorkspaceSidebarTree } from "@/features/workspace/components/WorkspaceSidebarTree";
import { MAIN_NAV } from "@/shared/config/navigation";
import { Badge } from "@/shared/components/ui/Badge";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-brand-600 text-white shadow-md shadow-brand-900/40"
      : "text-slate-300 hover:bg-white/10 hover:text-white",
  ].join(" ");
}

export function AppSidebar() {
  return (
    <aside className="flex w-[272px] shrink-0 flex-col border-r border-white/5 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-200 shadow-xl shadow-slate-950/30">
      <div className="flex h-14 items-center gap-3 border-b border-white/5 px-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-900/50">
          <LayoutTemplate className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-white">CTEL PM</p>
          <p className="truncate text-[11px] text-slate-500">Project Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {MAIN_NAV.slice(0, 1).map((section, si) => (
          <div key={si}>
            <ul className="space-y-1">
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
                            : "border-0 bg-white/10 text-slate-400 group-[.active]:bg-white/20 group-[.active]:text-white"
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

        <div className="mt-5">
          <WorkspaceSidebarTree />
        </div>

        {MAIN_NAV.slice(1).map((section, si) => (
          <div key={section.title ?? si} className="mt-6">
            {section.title && (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
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
                            : "border-0 bg-white/10 text-slate-400 group-[.active]:bg-white/20 group-[.active]:text-white"
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

      <div className="border-t border-white/5 p-3 text-[11px] text-slate-600">
        MVP · Workspace &amp; Auth
      </div>
    </aside>
  );
}
