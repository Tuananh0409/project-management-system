import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  Crown,
  Globe2,
  Link2,
  MailPlus,
  Shield,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiClientError } from "@/shared/api/client";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/Button";
import { Badge } from "@/shared/components/ui/Badge";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { LoadingState } from "@/shared/components/feedback/LoadingState";
import { getPrivacyModeLabel } from "@/shared/config/workspace-options";
import { workspaceApi } from "../api/workspaceApi";
import { InviteMemberModal } from "../components/InviteMemberModal";
import { MemberTable } from "../components/MemberTable";
import { PendingInvitationsList } from "../components/PendingInvitationsList";
import { WorkspaceAvatar } from "../components/WorkspaceAvatar";
import { WorkspaceDangerZone } from "../components/WorkspaceDangerZone";
import { WorkspaceLogoSection } from "../components/WorkspaceLogoSection";
import { WorkspaceProjectsSection } from "../components/WorkspaceProjectsSection";
import { useToast } from "@/shared/context/ToastContext";
import type { Invitation, Member, Workspace } from "../types";

export function WorkspaceDetailPage() {
  const toast = useToast();
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const isAdmin = workspace?.myRole?.toLowerCase() === "admin";
  const canCreateProject =
    workspace?.myRole?.toLowerCase() === "admin" ||
    workspace?.myRole?.toLowerCase() === "member";

  const load = useCallback(async () => {
    if (!workspaceSlug) return;
    setLoading(true);
    setError("");
    try {
      const [ws, mem, inv] = await Promise.all([
        workspaceApi.get(workspaceSlug),
        workspaceApi.listMembers(workspaceSlug),
        workspaceApi.listInvitations(workspaceSlug).catch(() => [] as Invitation[]),
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
  }, [workspaceSlug]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(confirmName: string) {
    if (!workspace) return;
    try {
      await workspaceApi.delete(workspace.slug, confirmName);
      toast.success(`Đã xóa workspace "${workspace.name}"`);
      navigate("/workspaces");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Không xóa được");
    }
  }

  async function handleRoleChange(userId: number, roleName: string) {
    try {
      await workspaceApi.updateMemberRole(workspaceSlug!, userId, roleName);
      toast.success("Đã cập nhật vai trò thành viên");
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Không đổi được role");
    }
  }

  async function handleRemoveMember(userId: number) {
    if (!confirm("Xóa thành viên khỏi workspace?")) return;
    try {
      await workspaceApi.removeMember(workspaceSlug!, userId);
      toast.success("Đã xóa thành viên khỏi workspace");
      load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Không xóa được");
    }
  }

  if (loading) {
    return (
      <div>
        <LoadingState />
        <div className="mt-6 h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-800">
        <p className="font-medium">{error || "Workspace không tồn tại"}</p>
        <Link
          to="/workspaces"
          className="mt-3 inline-flex text-sm font-semibold text-brand-700 hover:underline"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const theme = workspace.themeColor ?? "#2563eb";
  const privacyLabel = getPrivacyModeLabel(workspace.privacyMode);
  const isActive = workspace.status.toLowerCase() === "active";

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Tổng quan", to: "/" },
          { label: "Workspace", to: "/workspaces" },
          { label: workspace.name },
        ]}
      />

      {error && <ErrorAlert message={error} className="mb-4" />}

      {/* Hero — trang chi tiết workspace */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-100">
        <div
          className="h-20 bg-gradient-to-r from-slate-900 to-slate-800"
          style={{
            backgroundImage: `linear-gradient(120deg, ${theme} 0%, #0f172a 55%, #1e293b 100%)`,
          }}
        />
        <div className="-mt-10 flex flex-col gap-6 px-6 pb-6 sm:-mt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative">
              <WorkspaceAvatar workspace={workspace} size="lg" className="ring-4 ring-white shadow-lg" />
            </div>
            <div className="min-w-0 pb-0 sm:pb-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {workspace.name}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="font-mono text-xs font-semibold text-slate-600">
                  {workspace.code}
                </span>
                <span className="text-slate-300">·</span>
                <span className="truncate">{workspace.slug}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="brand" className="border-0 bg-brand-600 text-white">
                  {workspace.myRole}
                </Badge>
                <Badge
                  variant="muted"
                  className={
                    isActive
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : ""
                  }
                >
                  {isActive ? "Đang hoạt động" : workspace.status}
                </Badge>
                <Badge variant="muted" className="border border-slate-200 bg-slate-50 normal-case">
                  {privacyLabel}
                </Badge>
              </div>
            </div>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setShowInvite(true)}
              className="shrink-0 gap-2 rounded-xl shadow-md"
            >
              <MailPlus className="h-4 w-4" strokeWidth={2} />
              Mời thành viên
            </Button>
          )}
        </div>

        <div className="grid gap-3 border-t border-slate-100 px-6 py-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
            <Users className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={2} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thành viên
              </p>
              <p className="text-lg font-bold text-slate-900">{members.length}</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
            <Crown className="h-5 w-5 shrink-0 text-amber-600" strokeWidth={2} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quản trị
              </p>
              <p className="truncate text-lg font-bold text-slate-900">
                {workspace.ownerUsername}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
            <Globe2 className="h-5 w-5 shrink-0 text-sky-600" strokeWidth={2} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Múi giờ
              </p>
              <p className="truncate text-sm font-semibold text-slate-900">
                {workspace.timezone.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
            <Shield className="h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quyền riêng tư
              </p>
              <p className="text-sm font-semibold text-slate-900">
                {privacyLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5" />
            Cập nhật: {new Date(workspace.updatedAt).toLocaleString("vi-VN")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5" />
            ID workspace: {workspace.id}
          </span>
        </div>
      </div>

      {isAdmin && workspace && (
        <div className="mb-8">
          <WorkspaceLogoSection workspace={workspace} onUpdated={setWorkspace} />
        </div>
      )}

      <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Mô tả
        </h2>
        <p className="mt-2 text-slate-700 leading-relaxed">
          {workspace.description || "Chưa có mô tả cho workspace này."}
        </p>
      </div>

      <WorkspaceProjectsSection
        workspaceSlug={workspace.slug}
        workspaceId={workspace.id}
        canCreate={!!canCreateProject}
      />

      <section className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-slate-600" strokeWidth={2} />
          <h2 className="text-lg font-semibold text-slate-900">Thành viên</h2>
        </div>
        <MemberTable
          members={members}
          isAdmin={!!isAdmin}
          onRoleChange={handleRoleChange}
          onRemove={handleRemoveMember}
        />
      </section>

      {isAdmin && <PendingInvitationsList invitations={invitations} />}

      {isAdmin && (
        <WorkspaceDangerZone workspace={workspace} onDelete={handleDelete} />
      )}

      {showInvite && (
        <InviteMemberModal
          workspaceSlug={workspace.slug}
          onClose={() => setShowInvite(false)}
          onInvited={load}
        />
      )}
    </>
  );
}
