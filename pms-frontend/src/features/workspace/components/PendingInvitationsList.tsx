import type { Invitation } from "../types";

type Props = { invitations: Invitation[] };

export function PendingInvitationsList({ invitations }: Props) {
  if (invitations.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900">Lời mời đang chờ</h2>
      <ul className="mt-3 space-y-2">
        {invitations.map((inv) => (
          <li
            key={inv.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
          >
            <span>
              {inv.email} · {inv.roleName} · hết hạn{" "}
              {new Date(inv.expiredAt).toLocaleString("vi-VN")}
            </span>
            <code className="rounded bg-white px-2 py-1 text-xs">{inv.token}</code>
          </li>
        ))}
      </ul>
    </section>
  );
}
