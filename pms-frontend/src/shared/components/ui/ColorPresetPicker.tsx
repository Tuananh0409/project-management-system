import { inputClass } from "./formStyles";

type Props = {
  presets: readonly string[];
  value: string;
  onChange: (color: string) => void;
  allowCustom?: boolean;
};

export function ColorPresetPicker({
  presets,
  value,
  onChange,
  allowCustom = true,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5">
        {presets.map((c) => (
          <button
            key={c}
            type="button"
            title={c}
            onClick={() => onChange(c)}
            className={`h-9 w-9 rounded-xl border-2 shadow-sm transition hover:scale-105 ${
              value === c
                ? "border-slate-900 ring-2 ring-brand-500/30"
                : "border-white ring-1 ring-slate-200/80"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      {allowCustom && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={20}
          placeholder="#2563EB"
          className={`${inputClass} max-w-[10rem] font-mono text-xs`}
        />
      )}
    </div>
  );
}
