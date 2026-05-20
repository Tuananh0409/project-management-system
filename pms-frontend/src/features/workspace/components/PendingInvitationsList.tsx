import { Clock, Mail } from "lucide-react";
import type { Invitation } from "../types";

type Props = { invitations: Invitation[] };

export function PendingInvitationsList({ invitations }: Props) {
  if (invitations.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
        <Mail className="h-5 w-5 text-amber-600" strokeWidth={2} />
        Lời mời đang chờ
      </h2>
      <ul className="space-y-2">
        {invitations.map((inv) => (
          <li
            key={inv.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-white px-4 py-3 text-sm shadow-sm"
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-medium text-slate-900">{inv.email}</span>
              <span className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span>Vai trò: {inv.roleName}</span>
                <span className="inline-flex items-center gap-1 text-amber-800/90">
                  <Clock className="h-3.5 w-3.5" />
                  Hết hạn: {new Date(inv.expiredAt).toLocaleString("vi-VN")}
                </span>
              </span>
            </span>
            <code className="rounded-lg border border-amber-100 bg-white px-2 py-1 font-mono text-xs text-slate-600">
              {inv.token.slice(0, 12)}…
            </code>
          </li>
        ))}
      </ul>
    </section>
  );
}
