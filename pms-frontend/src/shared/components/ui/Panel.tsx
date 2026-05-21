import type { ReactNode } from "react";

type Props = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Khung section form — dùng chung nhiều trang cài đặt / tạo mới. */
export function Panel({ title, description, children, className = "" }: Props) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/5 ${className}`}
    >
      {(title || description) && (
        <header className="mb-5 border-b border-slate-100 pb-4">
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
