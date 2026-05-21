import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { PROJECT_TABS, type ProjectTabId } from "../../config/projectTabs";
import { Badge } from "@/shared/components/ui/Badge";

type Props = {
  activeTab: ProjectTabId;
};

export function ProjectTabNav({ activeTab }: Props) {
  const [, setSearchParams] = useSearchParams();

  function selectTab(id: ProjectTabId) {
    setSearchParams({ tab: id }, { replace: true });
  }

  return (
    <nav className="flex items-end gap-0 overflow-x-auto border-b border-slate-200 bg-white px-4 scrollbar-thin">
      {PROJECT_TABS.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => tab.available && selectTab(tab.id)}
            disabled={!tab.available}
            className={[
              "relative flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition",
              active
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900",
              !tab.available ? "cursor-not-allowed opacity-50" : "",
            ].join(" ")}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {tab.label}
            {!tab.available && (
              <Badge variant="muted" className="ml-1 px-1.5 py-0 text-[9px] normal-case">
                Sắp có
              </Badge>
            )}
          </button>
        );
      })}
      <button
        type="button"
        disabled
        className="mb-1 ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded text-slate-400"
        title="Thêm view (sắp có)"
      >
        <Plus className="h-4 w-4" />
      </button>
    </nav>
  );
}
