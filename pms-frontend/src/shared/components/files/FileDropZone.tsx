import { useRef } from "react";
import { Upload } from "lucide-react";
import { ATTACHMENT_ACCEPT } from "./attachmentRules";

type Props = {
  onFilesSelected: (files: FileList) => void;
  disabled?: boolean;
  hint?: string;
};

export function FileDropZone({
  onFilesSelected,
  disabled = false,
  hint = "PDF, Office, ảnh, ZIP — tối đa 20MB mỗi file",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0 || disabled) return;
    onFilesSelected(files);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      className={[
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
        disabled ? "cursor-not-allowed opacity-50" : "hover:border-brand-300 hover:bg-brand-50/40",
        "border-slate-200 bg-slate-50/50",
      ].join(" ")}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ATTACHMENT_ACCEPT}
        disabled={disabled}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        aria-label="Chọn tệp đính kèm"
        onChange={(e) => {
          e.stopPropagation();
          handleFiles(e.target.files);
        }}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="pointer-events-none relative z-0 flex flex-col items-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/80">
          <Upload className="h-6 w-6 text-brand-600" strokeWidth={2} />
        </span>
        <p className="text-sm font-medium text-slate-800">Kéo thả file hoặc bấm để chọn</p>
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      </div>
    </div>
  );
}
