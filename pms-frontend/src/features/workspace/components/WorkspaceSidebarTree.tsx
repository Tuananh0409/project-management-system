import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { projectApi } from "@/features/project/api/projectApi";
import type { ProjectSummary } from "@/features/project/types";
import { workspaceApi } from "../api/workspaceApi";
import type { Workspace } from "../types";
import { ApiClientError } from "@/shared/api/client";
import { useAuth } from "@/shared/context/AuthContext";
import {
  APP_EVENTS,
  type WorkspacesChangedDetail,
} from "@/shared/events/appEvents";
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
    "flex items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-sm transition",
    isActive
      ? "bg-brand-600/90 font-medium text-white"
      : "text-slate-400 hover:bg-slate-800 hover:text-white",
  ].join(" ");
}

function ProjectIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4 shrink-0 opacity-70"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

type Props = {
  onWorkspacesLoaded?: (workspaces: Workspace[]) => void;
};

export function WorkspaceSidebarTree({ onWorkspacesLoaded }: Props) {
  const { user } = useAuth();
  const location = useLocation();
  const canCreateWorkspace =
    user?.email?.toLowerCase() === "admin@ctel.local" || user?.id === 1;

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
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Phòng ban
        </p>
        {canCreateWorkspace && (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded p-0.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            title="Tạo phòng ban"
            aria-label="Tạo phòng ban"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}
      </div>

      {workspaces.length === 0 ? (
        <p className="px-3 py-2 text-xs leading-relaxed text-slate-500">
          {canCreateWorkspace
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
                    "group flex items-center gap-1 rounded-lg pr-1 transition",
                    isActiveWorkspace && !location.pathname.includes("/projects/")
                      ? "bg-slate-800"
                      : "hover:bg-slate-800/60",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpanded(workspace.id)}
                    className="flex shrink-0 items-center justify-center rounded p-1 text-slate-400 hover:text-white"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={[
                        "h-3.5 w-3.5 transition-transform",
                        isExpanded ? "rotate-90" : "",
                      ].join(" ")}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>

                  <Link
                    to={`/workspaces/${workspace.id}`}
                    className="flex min-w-0 flex-1 items-center gap-2 py-2 pr-1"
                    title={workspace.name}
                  >
                    <WorkspaceAvatar workspace={workspace} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-200 group-hover:text-white">
                      {workspace.name}
                    </span>
                  </Link>

                  <Link
                    to={`/workspaces/${workspace.id}`}
                    className="rounded p-1 text-slate-500 opacity-0 transition group-hover:opacity-100 hover:bg-slate-700 hover:text-white"
                    title="Cài đặt phòng ban"
                    aria-label="Cài đặt phòng ban"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                      <circle cx="5" cy="12" r="1.5" />
                      <circle cx="12" cy="12" r="1.5" />
                      <circle cx="19" cy="12" r="1.5" />
                    </svg>
                  </Link>
                </div>

                {isExpanded && (
                  <div className="relative ml-3 border-l border-slate-700/80 pl-1">
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
                              <ProjectIcon />
                              <span className="min-w-0 flex-1 truncate">{project.name}</span>
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

      {canCreateWorkspace && showCreate && (
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
