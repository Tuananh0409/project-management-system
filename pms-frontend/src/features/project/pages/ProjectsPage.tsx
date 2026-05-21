import { Link } from "react-router-dom";
import { PageHeader } from "@/shared/components/layout/PageHeader";

/** Route legacy — dự án được quản lý trong từng workspace. */
export function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Dự án"
        description="Mở phòng ban ở sidebar, tạo và quản lý dự án trong từng workspace."
      />
      <p className="text-sm text-slate-600">
        Chọn một <Link to="/workspaces" className="font-medium text-brand-600 hover:underline">phòng ban</Link> để xem danh sách dự án.
      </p>
    </>
  );
}
