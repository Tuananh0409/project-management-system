import { Plus } from "lucide-react";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "#94a3b8" },
  { id: "progress", title: "In Progress", color: "#3b82f6" },
  { id: "done", title: "Done", color: "#22c55e" },
];

export function ProjectBoardTab() {
  return (
    <div className="flex flex-1 flex-col bg-[#f6f7f9] p-6">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="flex w-72 shrink-0 flex-col rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
              <span className="text-sm font-semibold text-slate-800">{col.title}</span>
              <span
                className="rounded px-1.5 py-0.5 text-xs font-bold text-white"
                style={{ backgroundColor: col.color }}
              >
                0
              </span>
            </div>
            <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center p-4">
              <p className="text-center text-xs text-slate-400">Chưa có task</p>
            </div>
            <div className="border-t border-slate-100 p-2">
              <button
                type="button"
                disabled
                className="flex w-full items-center justify-center gap-1 rounded-md py-1.5 text-sm text-slate-500 opacity-60"
              >
                <Plus className="h-4 w-4" />
                Thêm
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-500">
        Kéo thả task giữa các cột sẽ hoạt động khi module Task được triển khai.
      </p>
    </div>
  );
}
