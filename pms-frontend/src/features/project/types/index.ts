export interface ProjectSummary {
  id: number;
  name: string;
  code: string;
  slug: string;
  colorCode: string | null;
  workspaceId: number;
}
