import { type FormEvent, useId, useState } from "react";
import { ApiClientError } from "@/shared/api/client";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import {
  COMMON_TIMEZONES,
  WORKSPACE_COLOR_PRESETS,
  WORKSPACE_PRIVACY_OPTIONS,
} from "@/shared/config/workspace-options";
import { workspaceApi } from "../api/workspaceApi";

const fieldClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

type Props = {
  onClose: () => void;
  onCreated: () => void;
};

export function CreateWorkspaceModal({ onClose, onCreated }: Props) {
  const advId = useId();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [privacyMode, setPrivacyMode] = useState("PRIVATE");
  const [themeColor, setThemeColor] = useState<string>(WORKSPACE_COLOR_PRESETS[0]);
  const [timezone, setTimezone] = useState("Asia/Ho_Chi_Minh");
  const [code, setCode] = useState("");
  const [slug, setSlug] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await workspaceApi.create({
        name,
        description: description.trim() || undefined,
        logoUrl: logoUrl.trim() || undefined,
        privacyMode,
        themeColor,
        timezone,
        code: showAdvanced && code.trim() ? code.trim() : undefined,
        slug: showAdvanced && slug.trim() ? slug.trim() : undefined,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Không thể tạo workspace",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Tạo workspace (phòng ban)" onClose={onClose}>
      <form onSubmit={handleSubmit} className="max-h-[85vh] space-y-4 overflow-y-auto pr-1">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Thông tin cơ bản
          </h3>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tên *</span>
            <input
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="Ví dụ: Phòng Kinh doanh"
            />
          </label>
          <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <strong>Mã phòng ban</strong> tự tạo từ tên. Ví dụ:{" "}
            <code className="font-mono">Phòng IT</code> → <code className="font-mono">IT</code>.
          </p>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={2000}
              className={fieldClass}
              placeholder="Mục tiêu, phạm vi phòng ban (tuỳ chọn)"
            />
          </label>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nhận diện (branding)
          </h3>
          <p className="mb-2 text-xs text-slate-500">Màu workspace — giống ClickUp / Monday.</p>
          <div className="flex flex-wrap gap-2">
            {WORKSPACE_COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => setThemeColor(c)}
                className={`h-8 w-8 rounded-lg border-2 shadow-sm transition ${
                  themeColor === c ? "border-slate-900 ring-2 ring-brand-500/40" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-slate-700">Hoặc mã màu</span>
            <input
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              maxLength={20}
              placeholder="#2563EB"
              className={`${fieldClass} max-w-xs font-mono`}
            />
          </label>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-slate-700">URL logo (https)</span>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              maxLength={500}
              className={fieldClass}
              placeholder="https://…"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Logo hiển thị trên thẻ workspace (tuỳ chọn — upload file sẽ làm sau).
            </span>
          </label>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Mặc định tổ chức
          </h3>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Quyền riêng tư</span>
            <select
              value={privacyMode}
              onChange={(e) => setPrivacyMode(e.target.value)}
              className={`${fieldClass} bg-white`}
            >
              {WORKSPACE_PRIVACY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-slate-500">
              {WORKSPACE_PRIVACY_OPTIONS.find((o) => o.value === privacyMode)?.hint}
            </span>
          </label>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-slate-700">Múi giờ (IANA)</span>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={`${fieldClass} bg-white`}
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
        </section>

        <div className="rounded-lg border border-slate-200 bg-white">
          <button
            type="button"
            id={advId}
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-slate-700"
          >
            Nâng cao: mã &amp; slug URL
            <span className="text-slate-400">{showAdvanced ? "▲" : "▼"}</span>
          </button>
          {showAdvanced && (
            <div className="grid grid-cols-1 gap-3 border-t border-slate-100 p-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Mã (ghi đè)</span>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={50}
                  className={fieldClass}
                  placeholder="Để trống = tự động"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Slug</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  maxLength={150}
                  className={fieldClass}
                  placeholder="Để trống = tự động"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo workspace"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
