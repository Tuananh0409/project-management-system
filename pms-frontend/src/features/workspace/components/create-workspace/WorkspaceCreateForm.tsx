import { type FormEvent, useId } from "react";
import { ChevronDown } from "lucide-react";
import {
  ColorPresetPicker,
  FormField,
  inputClass,
  Panel,
} from "@/shared/components/ui";
import {
  COMMON_TIMEZONES,
  WORKSPACE_COLOR_PRESETS,
  WORKSPACE_PRIVACY_OPTIONS,
} from "@/shared/config/workspace-options";
import { LogoUploadField } from "../LogoUploadField";
import type { WorkspaceCreatePreviewState } from "./WorkspaceCreatePreview";

type Props = {
  error: string;
  state: WorkspaceCreatePreviewState;
  logoPreview: string | null;
  showAdvanced: boolean;
  code: string;
  slug: string;
  onStateChange: (patch: Partial<WorkspaceCreatePreviewState>) => void;
  onLogoFileSelect: (file: File | null) => void;
  onShowAdvancedChange: (open: boolean) => void;
  onCodeChange: (code: string) => void;
  onSlugChange: (slug: string) => void;
  onSubmit: (e: FormEvent) => void;
};

export function WorkspaceCreateForm({
  error,
  state,
  showAdvanced,
  code,
  slug,
  logoPreview,
  onStateChange,
  onLogoFileSelect,
  onShowAdvancedChange,
  onCodeChange,
  onSlugChange,
  onSubmit,
}: Props) {
  const advId = useId();

  return (
    <form id="create-workspace-form" onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Panel
        title="Thông tin cơ bản"
        description="Mỗi phòng ban là một workspace — nơi chứa dự án và thành viên."
      >
        <div className="space-y-5">
          <FormField label="Tên phòng ban" required>
            <input
              required
              maxLength={100}
              value={state.name}
              onChange={(e) => onStateChange({ name: e.target.value })}
              className={inputClass}
              placeholder="Ví dụ: Phòng Công nghệ thông tin"
            />
          </FormField>
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
            <strong>Mã phòng ban</strong> được hệ thống tạo từ tên (ví dụ{" "}
            <code className="rounded bg-white px-1 font-mono text-slate-800">Phòng IT</code> →{" "}
            <code className="rounded bg-white px-1 font-mono text-slate-800">IT</code>). Có thể
            ghi đè ở phần nâng cao.
          </p>
          <FormField label="Mô tả" hint="Mục tiêu, phạm vi — có thể cập nhật sau.">
            <textarea
              value={state.description}
              onChange={(e) => onStateChange({ description: e.target.value })}
              rows={4}
              maxLength={2000}
              className={inputClass}
              placeholder="Phòng phụ trách phát triển sản phẩm nội bộ…"
            />
          </FormField>
        </div>
      </Panel>

      <Panel
        title="Nhận diện thương hiệu"
        description="Màu và logo hiển thị trên sidebar, thẻ workspace và header dự án."
      >
        <FormField label="Màu workspace">
          <ColorPresetPicker
            presets={WORKSPACE_COLOR_PRESETS}
            value={state.themeColor}
            onChange={(themeColor) => onStateChange({ themeColor })}
          />
        </FormField>
        <FormField label="Logo phòng ban" className="mt-5" hint="Tùy chọn — có thể đổi sau trên trang chi tiết.">
          <LogoUploadField previewUrl={logoPreview} onFileSelect={onLogoFileSelect} />
        </FormField>
      </Panel>

      <Panel
        title="Cấu hình tổ chức"
        description="Quyền riêng tư và múi giờ mặc định cho dự án trong phòng ban."
      >
        <FormField label="Quyền riêng tư">
          <select
            value={state.privacyMode}
            onChange={(e) => onStateChange({ privacyMode: e.target.value })}
            className={inputClass}
          >
            {WORKSPACE_PRIVACY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">
            {WORKSPACE_PRIVACY_OPTIONS.find((o) => o.value === state.privacyMode)?.hint}
          </p>
        </FormField>
        <FormField label="Múi giờ (IANA)" className="mt-5">
          <select
            value={state.timezone}
            onChange={(e) => onStateChange({ timezone: e.target.value })}
            className={inputClass}
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </FormField>
      </Panel>

      <Panel title="Tùy chọn nâng cao" description="Ghi đè mã hoặc slug URL khi cần.">
        <button
          type="button"
          id={advId}
          onClick={() => onShowAdvancedChange(!showAdvanced)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Mã phòng ban &amp; slug
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>
        {showAdvanced && (
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <FormField label="Mã (ghi đè)" hint="Để trống = tự động từ tên.">
              <input
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                maxLength={50}
                className={inputClass}
                placeholder="IT"
              />
            </FormField>
            <FormField label="Slug URL" hint="Để trống = tự động.">
              <input
                value={slug}
                onChange={(e) => onSlugChange(e.target.value)}
                maxLength={150}
                className={inputClass}
                placeholder="phong-it"
              />
            </FormField>
          </div>
        )}
      </Panel>
    </form>
  );
}
