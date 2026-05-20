import type { ReactNode } from "react";

type Props = {
  message: string;
  action?: ReactNode;
};

export function EmptyState({ message, action }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <p className="text-slate-600">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
