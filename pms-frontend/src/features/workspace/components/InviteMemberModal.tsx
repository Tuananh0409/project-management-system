import { type FormEvent, useState } from "react";
import { ApiClientError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { workspaceApi } from "../api/workspaceApi";

type Props = {
  workspaceId: number;
  onClose: () => void;
  onInvited: () => void;
};

export function InviteMemberModal({
  workspaceId,
  onClose,
  onInvited,
}: Props) {
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState("Member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInviteLink("");
    try {
      const inv = await workspaceApi.invite(workspaceId, { email, roleName });
      const link = `${window.location.origin}/invitations/${inv.token}/accept`;
      setInviteLink(link);
      onInvited();
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Không thể gửi lời mời",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Mời thành viên" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {inviteLink && (
          <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
            <p className="font-medium">Đã gửi lời mời!</p>
            <p className="mt-1 break-all text-xs">
              Member (user 2) mở link:{" "}
              <a href={inviteLink} className="underline">
                {inviteLink}
              </a>
            </p>
          </div>
        )}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email *</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="member@ctel.local"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Vai trò</span>
          <select
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
            <option value="Viewer">Viewer</option>
          </select>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi lời mời"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
