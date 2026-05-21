import { Building2, Clock, Globe2, Lock } from "lucide-react";
import { WORKSPACE_PRIVACY_OPTIONS } from "@/shared/config/workspace-options";

export type WorkspaceCreatePreviewState = {
  name: string;
  description: string;
  themeColor: string;
  logoPreview: string | null;
  privacyMode: string;
  timezone: string;
};

type Props = {
  state: WorkspaceCreatePreviewState;
  codeHint: string;
};

function privacyLabel(value: string) {
  return WORKSPACE_PRIVACY_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function WorkspaceCreatePreview({ state, codeHint }: Props) {
  const tzLabel = state.timezone.replace(/_/g, " ");

  return (
    <div className="sticky top-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Xem trước thẻ phòng ban
      </p>
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-100">
        <div
          className="h-3 transition-colors duration-300"
          style={{ backgroundColor: state.themeColor }}
        />
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md ring-2 ring-white"
              style={{ backgroundColor: state.themeColor }}
            >
              {state.logoPreview ? (
                <img
                  src={state.logoPreview}
                  alt=""
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <Building2 className="h-6 w-6" strokeWidth={1.75} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold text-slate-900">
                {state.name.trim() || "Tên phòng ban"}
              </h3>
              <p className="font-mono text-xs font-semibold text-slate-500">
                {codeHint}
              </p>
            </div>
          </div>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {state.description.trim() || "Mô tả phòng ban…"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              <Lock className="h-3 w-3" />
              {privacyLabel(state.privacyMode)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800">
              Admin
            </span>
          </div>
          <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <li className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {tzLabel}
            </li>
            <li className="flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5" />
              Dự án &amp; thành viên quản lý sau khi tạo
            </li>
          </ul>
        </div>
      </div>
      <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
        Bạn sẽ là Admin của phòng ban mới. Có thể mời thành viên ngay trên trang chi tiết.
      </p>
    </div>
  );
}
