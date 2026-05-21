import { useCallback, useEffect, useState } from "react";

import { Download, FileText, Loader2, Paperclip, Trash2 } from "lucide-react";

import { projectApi } from "../api/projectApi";

import type { ProjectAttachment } from "../types";

import { ApiClientError } from "@/shared/api/client";

import { FileDropZone } from "@/shared/components/files/FileDropZone";

import { formatFileSize } from "@/shared/components/files/formatFileSize";

import { validateAttachmentFile } from "@/shared/components/files/attachmentRules";

import { Button } from "@/shared/components/ui/Button";

import { useToast } from "@/shared/context/ToastContext";



type Props = {

  workspaceSlug: string;

  projectSlug: string;

  canUpload: boolean;

};



type UploadingItem = { name: string; size: number };



export function ProjectAttachmentsSection({ workspaceSlug, projectSlug, canUpload }: Props) {

  const toast = useToast();

  const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);

  const [initialLoading, setInitialLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [uploadQueue, setUploadQueue] = useState<UploadingItem[]>([]);

  const [error, setError] = useState("");



  const slugsValid =
    workspaceSlug.trim().length > 0 && projectSlug.trim().length > 0;



  const load = useCallback(

    async (silent = false) => {

      if (!slugsValid) return;

      if (silent) setRefreshing(true);

      else setInitialLoading(true);

      setError("");

      try {

        setAttachments(await projectApi.listAttachments(workspaceSlug, projectSlug));

      } catch (err) {

        const msg = err instanceof ApiClientError ? err.message : "Không tải được tệp đính kèm";

        setError(msg);

        if (!silent) toast.error(msg);

      } finally {

        setInitialLoading(false);

        setRefreshing(false);

      }

    },

    [workspaceSlug, projectSlug, slugsValid, toast],

  );



  useEffect(() => {

    load();

  }, [load]);



  async function handleUpload(files: FileList) {

    if (!slugsValid) return;

    const list = Array.from(files);

    const invalid = list.map((f) => validateAttachmentFile(f)).find(Boolean);

    if (invalid) {

      setError(invalid);

      toast.error(invalid);

      return;

    }



    setUploading(true);

    setUploadQueue(list.map((f) => ({ name: f.name, size: f.size })));

    setError("");



    let uploaded = 0;

    try {

      for (const file of list) {

        await projectApi.uploadAttachment(workspaceSlug, projectSlug, file);

        uploaded += 1;

      }

      toast.success(

        list.length === 1 ? "Đã tải file lên" : `Đã tải lên ${list.length} file`,

      );

      await load(true);

    } catch (err) {

      const msg = err instanceof ApiClientError ? err.message : "Không tải file lên được";

      setError(msg);

      toast.error(msg);

      if (uploaded > 0) await load(true);

    } finally {

      setUploading(false);

      setUploadQueue([]);

    }

  }



  async function handleDelete(id: number) {

    if (!confirm("Xóa tệp đính kèm này?")) return;

    try {

      await projectApi.deleteAttachment(workspaceSlug, projectSlug, id);

      toast.success("Đã xóa tệp đính kèm");

      await load(true);

    } catch (err) {

      const msg = err instanceof ApiClientError ? err.message : "Không xóa được";

      setError(msg);

      toast.error(msg);

    }

  }



  if (!slugsValid) {

    return (

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">

        Không xác định được phòng ban hoặc dự án — hãy mở lại từ danh sách phòng ban.

      </section>

    );

  }



  const showEmpty = !initialLoading && attachments.length === 0 && uploadQueue.length === 0;



  return (

    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">

      <div className="mb-4 flex items-center gap-2">

        <Paperclip className="h-5 w-5 text-slate-600" strokeWidth={2} />

        <h2 className="text-lg font-semibold text-slate-900">Tệp đính kèm dự án</h2>

        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">

          {attachments.length}

        </span>

        {refreshing && (

          <span className="text-xs text-slate-400">Đang cập nhật…</span>

        )}

      </div>



      {error && (

        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>

      )}



      {canUpload && (

        <div className="mb-6">

          <FileDropZone onFilesSelected={handleUpload} disabled={uploading} />

        </div>

      )}



      {initialLoading ? (

        <p className="flex items-center gap-2 text-sm text-slate-500">

          <Loader2 className="h-4 w-4 animate-spin" />

          Đang tải danh sách file…

        </p>

      ) : (

        <>

          {uploadQueue.length > 0 && (

            <ul className="mb-4 divide-y divide-brand-100 rounded-xl border border-brand-200 bg-brand-50/50">

              {uploadQueue.map((file, index) => (

                <li key={`${file.name}-${index}`} className="flex items-center gap-3 px-4 py-3">

                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-brand-600" />

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>

                    <p className="text-xs text-brand-700">Đang tải lên… {formatFileSize(file.size)}</p>

                  </div>

                </li>

              ))}

            </ul>

          )}



          {showEmpty ? (

            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-sm text-slate-500">

              Chưa có tệp đính kèm. Chọn file ở ô phía trên — danh sách hiện ngay sau khi upload xong.

            </p>

          ) : (

            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">

              {attachments.map((file) => (

                <li

                  key={file.id}

                  className="flex flex-wrap items-center gap-3 px-4 py-3 transition hover:bg-slate-50/80"

                >

                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">

                    <FileText className="h-5 w-5" strokeWidth={2} />

                  </span>

                  <div className="min-w-0 flex-1">

                    <p className="truncate font-medium text-slate-900">{file.fileName}</p>

                    <p className="text-xs text-slate-500">

                      {formatFileSize(file.fileSize)} · {file.uploadedByUsername} ·{" "}

                      {new Date(file.createdAt).toLocaleString("vi-VN")}

                    </p>

                  </div>

                  <div className="flex gap-2">

                    <a href={file.downloadUrl} download={file.fileName}>

                      <Button type="button" variant="secondary" className="gap-1.5 text-xs">

                        <Download className="h-3.5 w-3.5" />

                        Tải về

                      </Button>

                    </a>

                    {canUpload && (

                      <Button

                        type="button"

                        variant="secondary"

                        className="gap-1.5 text-xs text-red-700"

                        onClick={() => handleDelete(file.id)}

                      >

                        <Trash2 className="h-3.5 w-3.5" />

                        Xóa

                      </Button>

                    )}

                  </div>

                </li>

              ))}

            </ul>

          )}

        </>

      )}

    </section>

  );

}

