/** Đường dẫn app — dùng slug, không lộ id số trên URL. */
export function workspacePath(workspaceSlug: string) {
  return `/workspaces/${encodeURIComponent(workspaceSlug)}`;
}

export function createProjectPath(workspaceSlug: string) {
  return `${workspacePath(workspaceSlug)}/projects/new`;
}

export function projectPath(workspaceSlug: string, projectSlug: string, tab = "backlog") {
  const base = `${workspacePath(workspaceSlug)}/projects/${encodeURIComponent(projectSlug)}`;
  return tab ? `${base}?tab=${encodeURIComponent(tab)}` : base;
}
