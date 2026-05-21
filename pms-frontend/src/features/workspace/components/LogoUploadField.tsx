import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { LOGO_ACCEPT, validateLogoFile } from "@/shared/components/files/logoRules";
import { Button } from "@/shared/components/ui/Button";

type Props = {
  previewUrl: string | null;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  hint?: string;
};

export function LogoUploadField({
  previewUrl,
  disabled = false,
  onFileSelect,
  hint = "PNG, JPG, GIF hoặc WebP — tối đa 2MB",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFile(file: File | null) {
    setError("");
    if (!file) {
      onFileSelect(null);
      return;
    }
    const invalid = validateLogoFile(file);
    if (invalid) {
      setError(invalid);
      return;
    }
    onFileSelect(file);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start gap-4">
        <div
          className={[
            "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50",
            previewUrl ? "border-solid border-slate-200" : "",
          ].join(" ")}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Logo xem trước" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            type="file"
            accept={LOGO_ACCEPT}
            disabled={disabled}
            className="sr-only"
            aria-label="Chọn logo"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={disabled}
              className="rounded-xl text-sm"
              onClick={() => inputRef.current?.click()}
            >
              {previewUrl ? "Đổi logo" : "Tải logo lên"}
            </Button>
            {previewUrl && (
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                className="gap-1.5 rounded-xl text-sm text-slate-600"
                onClick={() => {
                  if (inputRef.current) inputRef.current.value = "";
                  handleFile(null);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
