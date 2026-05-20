import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiClientError } from "@/shared/api/client";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/Button";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { LoadingState } from "@/shared/components/feedback/LoadingState";
import { workspaceApi } from "../api/workspaceApi";
import { InviteMemberModal } from "../components/InviteMemberModal";
import { MemberTable } from "../components/MemberTable";
import { PendingInvitationsList } from "../components/PendingInvitationsList";
import { WorkspaceDangerZone } from "../components/WorkspaceDangerZone";
import type { Invitation, Member, Workspace } from "../types";

export function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const workspaceId = Number(id);
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const isAdmin = workspace?.myRole?.toLowerCase() === "admin";

  const load = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError("");
    try {
      const [ws, mem, inv] = await Promise.all([
        workspaceApi.get(workspaceId),
        workspaceApi.listMembers(workspaceId),
        workspaceApi.listInvitations(workspaceId).catch(() => [] as Invitation[]),
      ]);
      setWorkspace(ws);
      setMembers(mem);
      setInvitations(inv);
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Không tải được dữ liệu",
      );
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(confirmName: string) {
    if (!workspace) return;
    try {
      await workspaceApi.delete(workspace.id, confirmName);
      navigate("/workspaces");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Không xóa được");
    }
  }

  async function handleRoleChange(userId: number, roleName: string) {
    try {
      await workspaceApi.updateMemberRole(workspaceId, userId, roleName);
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Không đổi được role");
    }
  }

  async function handleRemoveMember(userId: number) {
    if (!confirm("Xóa thành viên khỏi workspace?")) return;
    try {
      await workspaceApi.removeMember(workspaceId, userId);
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Không xóa được");
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (!workspace) {
    return (
      <p className="text-red-600">
        {error || "Workspace không tồn tại"}{" "}
        <Link to="/workspaces" className="text-brand-600 underline">
          Quay lại danh sách
        </Link>
      </p>
    );
  }

  return (
    <>
      <PageHeader
        title={workspace.name}
        description={`${workspace.code} · ${workspace.slug} · Vai trò: ${workspace.myRole}`}
        breadcrumbs={[
          { label: "Tổng quan", to: "/" },
          { label: "Workspace", to: "/workspaces" },
          { label: workspace.name },
        ]}
        actions={
          isAdmin ? (
            <Button onClick={() => setShowInvite(true)}>Mời thành viên</Button>
          ) : undefined
        }
      />

      {workspace.description && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
          {workspace.description}
        </div>
      )}

      {error && <ErrorAlert message={error} className="mb-4" />}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Thành viên</h2>
        <div className="mt-3">
          <MemberTable
            members={members}
            isAdmin={!!isAdmin}
            onRoleChange={handleRoleChange}
            onRemove={handleRemoveMember}
          />
        </div>
      </section>

      {isAdmin && <PendingInvitationsList invitations={invitations} />}

      {isAdmin && (
        <WorkspaceDangerZone workspace={workspace} onDelete={handleDelete} />
      )}

      {showInvite && (
        <InviteMemberModal
          workspaceId={workspaceId}
          onClose={() => setShowInvite(false)}
          onInvited={load}
        />
      )}
    </>
  );
}
