/** Gợi ý mã phòng ban trên UI (khớp xấp xỉ logic backend SlugUtils). */
export function guessWorkspaceCode(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Tự động";

  const lower = trimmed
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  const remainder = lower
    .replace(/^(phong|ban|bo phan|khoi|trung tam|division|department)\s+/, "")
    .trim();
  const base = remainder || lower;
  const words = base.split(/[\s\-_.]+/).filter((w) => /^[a-z0-9]+$/.test(w));
  if (words.length === 0) return "PB";
  if (words.length === 1) {
    const w = words[0];
    return (w.length <= 8 ? w : w.slice(0, 6)).toUpperCase();
  }
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 8)
    .toUpperCase();
}
