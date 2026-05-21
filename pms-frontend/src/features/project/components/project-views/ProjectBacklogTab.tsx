import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Equal,
  GripHorizontal,
  Plus,
  Sparkles,
  User,
  X,
} from "lucide-react";
import type { ProjectDetail } from "../../types";
import { StatusCountPills } from "../project-shell/StatusCountPills";

/** Demo UI — thay bằng API Task khi có module S3 */
const DEMO_BACKLOG = [
  { id: 1, key: "7", title: "xây dựng csdl", label: "THIẾT KẾ BE" },
  { id: 2, key: "8", title: "tìm hiểu công nghệ", label: "THIẾT KẾ BE" },
  { id: 3, key: "9", title: "xác định các mqh của thực thể", label: "THIẾT KẾ BE" },
];

type Props = {
  project: ProjectDetail;
};

export function ProjectBacklogTab({ project }: Props) {
  const [boardOpen, setBoardOpen] = useState(true);
  const [backlogOpen, setBacklogOpen] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const prefix = project.code;

  const backlogCount = DEMO_BACKLOG.length;

  return (
    <div className="flex flex-1 flex-col bg-[#f6f7f9]">
      {/* Board section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <button
            type="button"
            onClick={() => setBoardOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-800"
          >
            {boardOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
            Board
            <span className="font-normal text-slate-500">(0 work items)</span>
          </button>
          <StatusCountPills
            pills={[
              { label: "To Do", count: 0, color: "#94a3b8" },
              { label: "In Progress", count: 0, color: "#3b82f6" },
              { label: "Done", count: 0, color: "#22c55e" },
            ]}
          />
        </div>
        {boardOpen && (
          <div className="px-6 pb-4">
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50">
              <p className="text-sm text-slate-500">Chưa có công việc trên board.</p>
              <button
                type="button"
                disabled
                className="mt-3 inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-brand-600 opacity-60"
              >
                <Plus className="h-4 w-4" />
                Tạo
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="flex items-center justify-center border-b border-slate-200 bg-white py-1">
        <GripHorizontal className="h-4 w-4 text-slate-300" aria-hidden />
      </div>

      {/* Backlog section */}
      <section className="flex-1 bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <button
            type="button"
            onClick={() => setBacklogOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-800"
          >
            {backlogOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
            Backlog
            <span className="font-normal text-slate-500">({backlogCount} work items)</span>
          </button>
          <div className="flex items-center gap-2">
            <StatusCountPills
              pills={[
                { label: "To Do", count: backlogCount, color: "#94a3b8" },
                { label: "In Progress", count: 0, color: "#3b82f6" },
                { label: "Done", count: 0, color: "#22c55e" },
              ]}
            />
            <button type="button" className="text-slate-400" disabled title="Automation (sắp có)">
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>

        {backlogOpen && (
          <div className="px-6 pb-6">
            {showBanner && (
              <div className="mb-3 flex items-center justify-between rounded-md border border-violet-100 bg-violet-50/80 px-3 py-2 text-sm text-violet-900">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-600" />
                  Giao diện mẫu — dữ liệu task thật sẽ kết nối API ở bước Task/Board.
                </span>
                <button
                  type="button"
                  onClick={() => setShowBanner(false)}
                  className="rounded p-0.5 text-violet-600 hover:bg-violet-100"
                  aria-label="Đóng"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {DEMO_BACKLOG.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-wrap items-center gap-3 px-3 py-2.5 transition hover:bg-slate-50/80"
                >
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 rounded border-slate-300"
                    aria-label={`Chọn ${task.title}`}
                  />
                  <span className="min-w-0 flex-1 text-sm text-slate-800">
                    <span className="font-medium text-slate-500">{prefix}-{task.key}</span>{" "}
                    {task.title}
                  </span>
                  <span className="rounded bg-violet-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-800">
                    {task.label}
                  </span>
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600"
                  >
                    TO DO
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <Equal className="h-4 w-4 text-amber-500" strokeWidth={2.5} aria-label="Ưu tiên trung bình" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                    <User className="h-4 w-4" />
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              disabled
              className="mt-3 inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-brand-600 opacity-70"
            >
              <Plus className="h-4 w-4" />
              Tạo
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
