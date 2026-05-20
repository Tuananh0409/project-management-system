import { type FormEvent, useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import type { Workspace } from "../types";

type Props = {
  workspace: Workspace;
  onDelete: (confirmName: string) => void;
};

export function WorkspaceDangerZone({ workspace, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onDelete(confirmDelete);
  }

  return (
    <section className="mt-10 rounded-2xl border border-red-200/80 bg-gradient-to-b from-red-50/80 to-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-red-900">Vùng nguy hiểm</h2>
      <p className="mt-1 text-sm text-red-800/90">
        Nhập đúng tên workspace để xóa: <strong>{workspace.name}</strong>
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-2">
        <input
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
          placeholder={workspace.name}
          className="min-w-[200px] flex-1 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
        />
        <Button type="submit" variant="danger" className="rounded-xl">
          Xóa workspace
        </Button>
      </form>
    </section>
  );
}
