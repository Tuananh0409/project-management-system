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
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white text-slate-600">
          <tr>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide">
              Thành viên
            </th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide">Email</th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide">Vai trò</th>
            <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide">Tham gia</th>
            {isAdmin && <th className="px-5 py-3.5" />}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr
              key={m.userId}
              className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/80"
            >
              <td className="px-5 py-3.5 font-medium text-slate-900">{m.username}</td>
              <td className="px-5 py-3.5 text-slate-600">{m.email}</td>
              <td className="px-5 py-3.5">
                {isAdmin ? (
                  <select
                    value={m.roleName}
                    onChange={(e) => onRoleChange(m.userId, e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-800 shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {m.roleName}
                  </span>
                )}
              </td>
              <td className="px-5 py-3.5 text-slate-500">
                {new Date(m.joinedAt).toLocaleDateString("vi-VN")}
              </td>
              {isAdmin && (
                <td className="px-5 py-3.5 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
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
