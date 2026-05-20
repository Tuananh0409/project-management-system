import { Button } from "@/shared/components/ui/Button";
import type { Member } from "../types";

type Props = {
  members: Member[];
  isAdmin: boolean;
  onRoleChange: (userId: number, roleName: string) => void;
  onRemove: (userId: number) => void;
};

export function MemberTable({
  members,
  isAdmin,
  onRoleChange,
  onRemove,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Vai trò</th>
            <th className="px-4 py-3 font-medium">Tham gia</th>
            {isAdmin && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.userId} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3 font-medium">{m.username}</td>
              <td className="px-4 py-3 text-slate-600">{m.email}</td>
              <td className="px-4 py-3">
                {isAdmin ? (
                  <select
                    value={m.roleName}
                    onChange={(e) => onRoleChange(m.userId, e.target.value)}
                    className="rounded border border-slate-300 px-2 py-1 text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                ) : (
                  m.roleName
                )}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(m.joinedAt).toLocaleDateString("vi-VN")}
              </td>
              {isAdmin && (
                <td className="px-4 py-3 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onRemove(m.userId)}
                  >
                    Xóa
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
