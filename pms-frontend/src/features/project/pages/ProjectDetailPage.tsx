import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projectApi } from "../api/projectApi";
import { workspaceApi } from "@/features/workspace/api/workspaceApi";
import type { ProjectSummary } from "../types";
import { ApiClientError } from "@/shared/api/client";
import { ComingSoonPage } from "@/shared/components/feedback/ComingSoonPage";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { LoadingState } from "@/shared/components/feedback/LoadingState";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function ProjectDetailPage() {
  const { id: workspaceIdParam, projectId: projectIdParam } = useParams();
  const workspaceId = Number(workspaceIdParam);
  const projectId = Number(projectIdParam);

  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!workspaceId || !projectId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [workspace, projects] = await Promise.all([
          workspaceApi.get(workspaceId),
          projectApi.listByWorkspace(workspaceId),
        ]);
        if (cancelled) return;
        setWorkspaceName(workspace.name);
        const found = projects.find((p) => p.id === projectId) ?? null;
        setProject(found);
        if (!found) {
          setError("Không tìm thấy dự án trong phòng ban này.");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError ? err.message : "Không tải được dự án",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [workspaceId, projectId]);

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <>
        <PageHeader
          title="Dự án"
          breadcrumbs={[
            { label: "Tổng quan", to: "/" },
            { label: "Phòng ban", to: `/workspaces/${workspaceId}` },
          ]}
        />
        <ErrorAlert message={error} />
        <Link to={`/workspaces/${workspaceId}`} className="mt-4 inline-block text-sm text-brand-600">
          ← Quay lại phòng ban
        </Link>
      </>
    );
  }

  if (!project) return null;

  return (
    <>
      <PageHeader
        title={project.name}
        description={`${project.code} · ${workspaceName}`}
        breadcrumbs={[
          { label: "Tổng quan", to: "/" },
          { label: workspaceName, to: `/workspaces/${workspaceId}` },
          { label: project.name },
        ]}
      />
      <ComingSoonPage
        title={project.name}
        description="Kanban, task và milestone sẽ hiển thị tại đây."
        moduleName="Project (S2)"
      />
    </>
  );
}
