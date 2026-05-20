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
    <section className="mt-10 rounded-xl border border-red-200 bg-red-50/50 p-6">
      <h2 className="text-lg font-semibold text-red-800">Vùng nguy hiểm</h2>
      <p className="mt-1 text-sm text-red-700">
        Nhập đúng tên workspace để xóa: <strong>{workspace.name}</strong>
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap gap-2">
        <input
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
          placeholder={workspace.name}
          className="min-w-[200px] flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm"
        />
        <Button type="submit" variant="danger">
          Xóa workspace
        </Button>
      </form>
    </section>
  );
}
