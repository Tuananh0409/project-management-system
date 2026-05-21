import { useState } from "react";
import { workspaceApi } from "@/features/workspace/api/workspaceApi";
import type { Workspace } from "@/features/workspace/types";
import { ApiClientError } from "@/shared/api/client";
import { Panel } from "@/shared/components/ui/Panel";
import { useToast } from "@/shared/context/ToastContext";
import { notifyWorkspacesChanged } from "@/shared/events/appEvents";
import { LogoUploadField } from "./LogoUploadField";

type Props = {
  workspace: Workspace;
  onUpdated: (workspace: Workspace) => void;
};

export function WorkspaceLogoSection({ workspace, onUpdated }: Props) {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [previewOverride, setPreviewOverride] = useState<string | null>(null);

  const previewUrl =
    previewOverride ??
    (workspace.logoUrl
      ? `${workspace.logoUrl}${workspace.updatedAt ? `?v=${encodeURIComponent(workspace.updatedAt)}` : ""}`
      : null);

  async function handleUpload(file: File | null) {
    if (!file) {
      setUploading(true);
      try {
        await workspaceApi.deleteLogo(workspace.slug);
        setPreviewOverride(null);
        onUpdated({ ...workspace, logoUrl: null });
        toast.success("Đã xóa logo");
        notifyWorkspacesChanged({ workspaceId: workspace.id });
      } catch (err) {
        toast.error(err instanceof ApiClientError ? err.message : "Không xóa được logo");
      } finally {
        setUploading(false);
      }
      return;
    }

    if (previewOverride?.startsWith("blob:")) {
      URL.revokeObjectURL(previewOverride);
    }
    const blobUrl = URL.createObjectURL(file);
    setPreviewOverride(blobUrl);
    setUploading(true);
    try {
      const updated = await workspaceApi.uploadLogo(workspace.slug, file);
      setPreviewOverride(null);
      onUpdated(updated);
      toast.success("Đã cập nhật logo");
      notifyWorkspacesChanged({ workspaceId: workspace.id });
    } catch (err) {
      setPreviewOverride(null);
      toast.error(err instanceof ApiClientError ? err.message : "Không tải logo lên được");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Panel title="Logo phòng ban" description="Ảnh hiển thị trên sidebar và thẻ workspace.">
      <LogoUploadField
        previewUrl={previewUrl}
        disabled={uploading}
        onFileSelect={handleUpload}
      />
    </Panel>
  );
}
