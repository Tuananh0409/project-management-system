import { FileText, X } from "lucide-react";
import type { PendingFileMeta } from "./pendingFiles";
import { formatFileSize } from "./formatFileSize";

type Props = {
  files: PendingFileMeta[];
  onRemove: (id: string) => void;
  disabled?: boolean;
};

export function PendingFileList({ files, onRemove, disabled = false }: Props) {
  if (files.length === 0) return null;

  return (
    <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
      {files.map((file) => (
        <li key={file.id} className="flex items-center gap-3 px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <FileText className="h-4 w-4" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRemove(file.id)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label={`Xóa ${file.name}`}
          >
            <X className="h-4 w-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
