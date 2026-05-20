import { useCallback, useEffect, useState } from "react";
import { ApiClientError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/Button";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { LoadingState } from "@/shared/components/feedback/LoadingState";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { workspaceApi } from "../api/workspaceApi";
import { useAuth } from "@/shared/context/AuthContext";
import { CreateWorkspaceModal } from "../components/CreateWorkspaceModal";
import { WorkspaceCard } from "../components/WorkspaceCard";
import type { Workspace } from "../types";

export function WorkspaceListPage() {
  const { user } = useAuth();
  const canCreateWorkspace =
    user?.email?.toLowerCase() === "admin@ctel.local" || user?.id === 1;
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

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

  return (
    <>
      <PageHeader
        title="Workspace"
        description="Quản lý không gian làm việc và thành viên"
        breadcrumbs={[{ label: "Tổng quan", to: "/" }, { label: "Workspace" }]}
        actions={
          canCreateWorkspace ? (
            <Button onClick={() => setShowCreate(true)}>+ Tạo Workspace</Button>
          ) : undefined
        }
      />

      {error && <ErrorAlert message={error} className="mb-4" />}

      {loading ? (
        <LoadingState />
      ) : workspaces.length === 0 ? (
        <EmptyState
          message="Chưa có workspace nào."
          action={
            canCreateWorkspace ? (
              <Button onClick={() => setShowCreate(true)}>
                Tạo workspace đầu tiên
              </Button>
            ) : (
              <p className="text-sm text-slate-500">Chỉ admin hệ thống mới tạo được workspace.</p>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((w) => (
            <WorkspaceCard key={w.id} workspace={w} />
          ))}
        </div>
      )}

      {canCreateWorkspace && showCreate && (
        <CreateWorkspaceModal
          onClose={() => setShowCreate(false)}
          onCreated={load}
        />
      )}
    </>
  );
}
