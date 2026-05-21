import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Filter, Search, ShieldCheck, UsersRound } from "lucide-react";
import { ApiClientError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { LoadingState } from "@/shared/components/feedback/LoadingState";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { canCreateWorkspace } from "@/shared/utils/workspacePermissions";
import { workspaceApi } from "../api/workspaceApi";
import { useAuth } from "@/shared/context/AuthContext";
import { WorkspaceCard } from "../components/WorkspaceCard";
import type { Workspace } from "../types";

export function WorkspaceListPage() {
  const { user } = useAuth();
  const canCreate = canCreateWorkspace(user);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const createHref = "/workspaces/new";
  const [privacyFilter, setPrivacyFilter] = useState<"ALL" | "PRIVATE" | "ORG_WIDE">("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setWorkspaces(await workspaceApi.list());
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Không tải được danh sách",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredWorkspaces = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    return workspaces.filter((workspace) => {
      const matchKeyword =
        keyword.length === 0 ||
        workspace.name.toLowerCase().includes(keyword) ||
        workspace.code.toLowerCase().includes(keyword) ||
        (workspace.description?.toLowerCase().includes(keyword) ?? false);
      const matchPrivacy =
        privacyFilter === "ALL" || workspace.privacyMode === privacyFilter;
      return matchKeyword && matchPrivacy;
    });
  }, [privacyFilter, searchKeyword, workspaces]);

  const statItems = useMemo(() => {
    const total = workspaces.length;
    const orgWide = workspaces.filter((w) => w.privacyMode === "ORG_WIDE").length;
    const privateCount = total - orgWide;
    const myAdminCount = workspaces.filter(
      (w) => w.myRole.toLowerCase() === "admin",
    ).length;
    return [
      {
        label: "Tổng workspace",
        value: total,
        icon: Building2,
        accent: "from-blue-500 to-indigo-500",
      },
      {
        label: "Riêng tư",
        value: privateCount,
        icon: ShieldCheck,
        accent: "from-emerald-500 to-teal-500",
      },
      {
        label: "Nội bộ tổ chức",
        value: orgWide,
        icon: UsersRound,
        accent: "from-fuchsia-500 to-pink-500",
      },
      {
        label: "Bạn là admin",
        value: myAdminCount,
        icon: Filter,
        accent: "from-amber-500 to-orange-500",
      },
    ];
  }, [workspaces]);

  return (
    <>
      <PageHeader
        title="Workspace"
        description="Không gian làm việc theo phòng ban — quản lý thành viên, quyền truy cập và dự án."
        breadcrumbs={[{ label: "Tổng quan", to: "/" }, { label: "Workspace" }]}
        actions={
          canCreate ? (
            <Link to={createHref}>
              <Button className="rounded-xl px-4 py-2.5 shadow-sm">+ Tạo phòng ban</Button>
            </Link>
          ) : undefined
        }
      />

      {error && <ErrorAlert message={error} className="mb-4" />}

      {!loading && workspaces.length > 0 && (
        <>
          <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <span
                    className={`inline-flex rounded-lg bg-gradient-to-r p-2 text-white ${stat.accent}`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm theo tên, mã hoặc mô tả workspace..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Privacy
              </span>
              <select
                value={privacyFilter}
                onChange={(e) =>
                  setPrivacyFilter(e.target.value as "ALL" | "PRIVATE" | "ORG_WIDE")
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="ALL">Tất cả</option>
                <option value="PRIVATE">Riêng tư</option>
                <option value="ORG_WIDE">Nội bộ tổ chức</option>
              </select>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div>
          <LoadingState />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </div>
      ) : workspaces.length === 0 ? (
        <EmptyState
          message="Chưa có workspace nào."
          action={
            canCreate ? (
              <Link to={createHref}>
                <Button>Tạo phòng ban đầu tiên</Button>
              </Link>
            ) : (
              <p className="text-sm text-slate-500">Chỉ admin hệ thống mới tạo được workspace.</p>
            )
          }
        />
      ) : filteredWorkspaces.length === 0 ? (
        <EmptyState
          message="Không tìm thấy workspace phù hợp bộ lọc."
          action={
            <Button
              variant="secondary"
              className="rounded-xl"
              onClick={() => {
                setSearchKeyword("");
                setPrivacyFilter("ALL");
              }}
            >
              Xóa bộ lọc
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWorkspaces.map((w) => (
            <WorkspaceCard key={w.id} workspace={w} />
          ))}
        </div>
      )}

    </>
  );
}
