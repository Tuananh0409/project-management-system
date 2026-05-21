type StatusPill = {
  label: string;
  count: number;
  color: string;
};

type Props = {
  pills: StatusPill[];
};

export function StatusCountPills({ pills }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      {pills.map((p) => (
        <span
          key={p.label}
          className="inline-flex min-w-[2rem] items-center justify-center rounded px-1.5 py-0.5 text-xs font-semibold text-white"
          style={{ backgroundColor: p.color }}
          title={p.label}
        >
          {p.count}
        </span>
      ))}
    </div>
  );
}
