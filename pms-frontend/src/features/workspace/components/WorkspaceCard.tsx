import { Clock3, Globe2, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/shared/components/ui/Badge";
import { getPrivacyModeLabel } from "@/shared/config/workspace-options";
import { workspacePath } from "@/shared/routes/paths";
import type { Workspace } from "../types";
import { WorkspaceAvatar } from "./WorkspaceAvatar";

type Props = { workspace: Workspace };

export function WorkspaceCard({ workspace }: Props) {
  const privacyLabel = getPrivacyModeLabel(workspace.privacyMode);
  const isActive = workspace.status.toLowerCase() === "active";

  return (
    <Link
      to={workspacePath(workspace.slug)}
      className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm ring-1 ring-white transition duration-200 hover:-translate-y-0.5 hover:border-brand-300/70 hover:shadow-lg hover:shadow-slate-900/5"
    >
      <div
        className="h-2 w-full"
        style={{ backgroundColor: workspace.themeColor ?? "#2563eb" }}
      />
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <WorkspaceAvatar workspace={workspace} />
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-700">
                {workspace.name}
              </h3>
              <p className="truncate text-xs text-slate-500">{workspace.code}</p>
            </div>
          </div>
          <Badge variant="muted" className="border border-slate-200/80 bg-slate-50">
            {workspace.myRole}
          </Badge>
        </div>

        {workspace.description ? (
          <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-600">
            {workspace.description}
          </p>
        ) : (
          <p className="mb-4 min-h-10 text-sm text-slate-400">
            Chưa có mô tả cho workspace này.
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-600">
            <div className="mb-1 inline-flex items-center gap-1 text-slate-500">
              <Shield className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wide">Quyền riêng tư</span>
            </div>
            <p className="font-semibold text-slate-800">
              {privacyLabel}
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-slate-600">
            <div className="mb-1 inline-flex items-center gap-1 text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wide">Múi giờ</span>
            </div>
            <p className="font-semibold text-slate-800">{workspace.timezone}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {workspace.ownerUsername}
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe2 className="h-3.5 w-3.5" />
            {isActive ? "Đang hoạt động" : workspace.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
