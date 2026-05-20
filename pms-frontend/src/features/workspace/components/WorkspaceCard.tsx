import { Link } from "react-router-dom";
import type { Workspace } from "../types";
import { WorkspaceAvatar } from "./WorkspaceAvatar";

type Props = { workspace: Workspace };

export function WorkspaceCard({ workspace }: Props) {
  return (
    <Link
      to={`/workspaces/${workspace.id}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-500/40 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <WorkspaceAvatar workspace={workspace} />
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {workspace.myRole}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">
        {workspace.name}
      </h3>
      {workspace.description && (
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {workspace.description}
        </p>
      )}
      <p className="mt-3 text-xs text-slate-400">
        {workspace.code} · {workspace.status}
      </p>
    </Link>
  );
}
