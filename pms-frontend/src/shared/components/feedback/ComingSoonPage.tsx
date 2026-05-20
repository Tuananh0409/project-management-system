import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import { PageHeader } from "@/shared/components/layout/PageHeader";

type Props = {
  title: string;
  description: string;
  moduleName: string;
};

export function ComingSoonPage({ title, description, moduleName }: Props) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
          🚧
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Đang phát triển</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Module <strong>{moduleName}</strong> sẽ được bổ sung sau khi hoàn thiện API
          backend. Giao diện sidebar và routing đã sẵn sàng.
        </p>
        <Link to="/workspaces" className="mt-6">
          <Button variant="secondary">Về Workspace (đã có)</Button>
        </Link>
      </div>
    </>
  );
}
