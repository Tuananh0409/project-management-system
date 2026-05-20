import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronRight, Ellipsis, ListTodo, Plus } from "lucide-react";import { projectApi } from "@/features/project/api/projectApi";
import type { ProjectSummary } from "@/features/project/types";
import { workspaceApi } from "../api/workspaceApi";
import type { Workspace } from "../types";
import { ApiClientError } from "@/shared/api/client";
import { useAuth } from "@/shared/context/AuthContext";
import {
  APP_EVENTS,
  type WorkspacesChangedDetail,
} from "@/shared/events/appEvents";
import { canCreateWorkspace } from "@/shared/utils/workspacePermissions";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import { WorkspaceAvatar } from "./WorkspaceAvatar";

const EXPANDED_KEY = "pms.sidebar.expandedWorkspaces";

function readExpandedIds(): Set<number> {
  try {
    const raw = localStorage.getItem(EXPANDED_KEY);
    if (!raw) return new Set();
    const ids = JSON.parse(raw) as number[];
    return new Set(ids);
  } catch {
    return new Set();
  }
}

function persistExpandedIds(ids: Set<number>) {
  localStorage.setItem(EXPANDED_KEY, JSON.stringify([...ids]));
}

function projectNavClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-2 rounded-lg py-1.5 pl-7 pr-2 text-sm transition",
    isActive
      ? "bg-brand-600/95 font-medium text-white shadow-sm"
      : "text-slate-400 hover:bg-slate-800/90 hover:text-white",
  ].join(" ");
}
type Props = {
  onWorkspacesLoaded?: (workspaces: Workspace[]) => void;
};

export function WorkspaceSidebarTree({ onWorkspacesLoaded }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const canCreate = canCreateWorkspace(user);

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(() => readExpandedIds());
  const [projectsByWorkspace, setProjectsByWorkspace] = useState<
    Record<number, ProjectSummary[]>
  >({});
  const [loadingProjects, setLoadingProjects] = useState<Set<number>>(new Set());
  const [showCreate, setShowCreate] = useState(false);

  const loadWorkspaces = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await workspaceApi.list();
      setWorkspaces(list);
      onWorkspacesLoaded?.(list);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Không tải được phòng ban",
      );
    } finally {
      setLoading(false);
    }
  }, [onWorkspacesLoaded]);

  const loadProjects = useCallback(async (workspaceId: number) => {
    setLoadingProjects((prev) => new Set(prev).add(workspaceId));
    try {
      const projects = await projectApi.listByWorkspace(workspaceId);
      setProjectsByWorkspace((prev) => ({ ...prev, [workspaceId]: projects }));
    } catch {
      setProjectsByWorkspace((prev) => ({ ...prev, [workspaceId]: [] }));
    } finally {
      setLoadingProjects((prev) => {
        const next = new Set(prev);
        next.delete(workspaceId);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  useEffect(() => {
    function handleWorkspacesChanged(event: Event) {
      const detail = (event as CustomEvent<WorkspacesChangedDetail>).detail;
      void loadWorkspaces().then(() => {
        if (detail?.workspaceId == null) return;
        setExpanded((prev) => {
          const next = new Set(prev);
          next.add(detail.workspaceId!);
          persistExpandedIds(next);
          return next;
        });
        loadProjects(detail.workspaceId);
      });
    }

    window.addEventListener(APP_EVENTS.workspacesChanged, handleWorkspacesChanged);
    return () => {
      window.removeEventListener(APP_EVENTS.workspacesChanged, handleWorkspacesChanged);
    };
  }, [loadWorkspaces, loadProjects]);

  const activeWorkspaceId = useMemo(() => {
    const match = location.pathname.match(/^\/workspaces\/(\d+)/);
    return match ? Number(match[1]) : null;
  }, [location.pathname]);

  useEffect(() => {
    if (activeWorkspaceId == null) return;
    setExpanded((prev) => {
      if (prev.has(activeWorkspaceId)) return prev;
      const next = new Set(prev);
      next.add(activeWorkspaceId);
      persistExpandedIds(next);
      return next;
    });
    if (!projectsByWorkspace[activeWorkspaceId]) {
      loadProjects(activeWorkspaceId);
    }
  }, [activeWorkspaceId, loadProjects, projectsByWorkspace]);

  useEffect(() => {
    expanded.forEach((id) => {
      if (!projectsByWorkspace[id] && !loadingProjects.has(id)) {
        loadProjects(id);
      }
    });
  }, [expanded, projectsByWorkspace, loadingProjects, loadProjects]);

  const toggleExpanded = (workspaceId: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(workspaceId)) {
        next.delete(workspaceId);
      } else {
        next.add(workspaceId);
        if (!projectsByWorkspace[workspaceId]) {
          loadProjects(workspaceId);
        }
      }
      persistExpandedIds(next);
      return next;
    });
  };

  if (loading) {
    return <p className="px-3 py-2 text-xs text-slate-500">Đang tải phòng ban…</p>;
  }

  if (error) {
    return <p className="px-3 py-2 text-xs text-red-400">{error}</p>;
  }

  return (
    <>
      <div className="mb-2 flex items-center justify-between px-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Phòng ban
        </p>
        {canCreate && (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-white"
            title="Tạo phòng ban"
            aria-label="Tạo phòng ban"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        )}      </div>

      {workspaces.length === 0 ? (
        <p className="px-3 py-2 text-xs leading-relaxed text-slate-500">
          {canCreate
            ? "Chưa có phòng ban. Nhấn + để tạo."
            : "Bạn chưa tham gia phòng ban nào. Chờ admin mời."}
        </p>
      ) : (
        <ul className="space-y-0.5">
          {workspaces.map((workspace) => {
            const isExpanded = expanded.has(workspace.id);
            const projects = projectsByWorkspace[workspace.id];
            const isLoadingProjects = loadingProjects.has(workspace.id);
            const isActiveWorkspace = activeWorkspaceId === workspace.id;

            return (
              <li key={workspace.id}>
                <div
                  className={[
                    "group flex items-center gap-1 rounded-xl pr-1 transition",
                    isActiveWorkspace && !location.pathname.includes("/projects/")
                      ? "bg-white/10 shadow-sm ring-1 ring-white/10"
                      : "hover:bg-white/5",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpanded(workspace.id)}
                    className="flex shrink-0 items-center justify-center rounded-lg p-1 text-slate-500 hover:bg-white/10 hover:text-white"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                  >
                    <ChevronRight
                      className={[
                        "h-4 w-4 transition-transform duration-200",
                        isExpanded ? "rotate-90" : "",
                      ].join(" ")}
                      strokeWidth={2}
                    />
                  </button>
                  <Link
                    to={`/workspaces/${workspace.id}`}
                    className="flex min-w-0 flex-1 items-center gap-2 py-2 pr-1"
                    title={workspace.name}
                  >
                    <WorkspaceAvatar workspace={workspace} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-100 group-hover:text-white">
                      {workspace.name}
                    </span>
                  </Link>

                  <Link
                    to={`/workspaces/${workspace.id}`}
                    className="rounded-md p-1 text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 hover:text-white"
                    title="Cài đặt phòng ban"
                    aria-label="Cài đặt phòng ban"
                  >
                    <Ellipsis className="h-4 w-4" strokeWidth={2} />
                  </Link>                </div>

                {isExpanded && (
                  <div className="relative ml-3 border-l border-white/10 pl-2">
                    {isLoadingProjects && !projects && (
                      <p className="py-1.5 pl-8 text-xs text-slate-500">Đang tải dự án…</p>
                    )}
                    {projects && projects.length === 0 && !isLoadingProjects && (
                      <p className="py-1.5 pl-8 text-xs text-slate-500">Chưa có dự án</p>
                    )}
                    {projects && projects.length > 0 && (
                      <ul className="py-0.5">
                        {projects.map((project) => (
                          <li key={project.id}>
                            <NavLink
                              to={`/workspaces/${workspace.id}/projects/${project.id}`}
                              className={projectNavClass}
                            >
                              <ListTodo className="h-4 w-4 shrink-0 opacity-80" strokeWidth={2} />                              <span className="min-w-0 flex-1 truncate">{project.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {canCreate && showCreate && (
        <CreateWorkspaceModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            loadWorkspaces();
          }}
        />
      )}
    </>
  );
}
