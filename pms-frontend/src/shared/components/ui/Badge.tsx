type Variant = "default" | "brand" | "warning" | "muted";

const styles: Record<Variant, string> = {
  default: "bg-slate-100 text-slate-600",
  brand: "bg-brand-100 text-brand-700",
  warning: "bg-amber-100 text-amber-800",
  muted: "bg-slate-200/80 text-slate-500",
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

export function Badge({ children, variant = "default", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
