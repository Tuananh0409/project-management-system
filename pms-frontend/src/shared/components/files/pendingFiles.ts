/** Metadata hiển thị UI — file thật giữ trong ref (tránh crash React khi setState File[]). */
export type PendingFileMeta = {
  id: string;
  name: string;
  size: number;
};

export function createPendingFileMeta(file: File): PendingFileMeta {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
  };
}

export function newToastId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
