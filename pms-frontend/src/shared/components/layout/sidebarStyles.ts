/** Style chung sidebar sáng (ClickUp / Linear). */

export const SIDEBAR_SHELL =
  "flex w-[260px] shrink-0 flex-col border-r border-slate-200/90 bg-white text-slate-800";

export function mainNavClass({ isActive }: { isActive: boolean }) {
  return [
    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
    isActive
      ? "bg-[#eef0f3] text-slate-900 [&_svg]:text-slate-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 [&_svg]:text-slate-500",
  ].join(" ");
}

export const SIDEBAR_SECTION_LABEL =
  "px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400";
