const pad = (n: number) => String(n).padStart(2, '0');

// "2026-11-21T15:42:00.000Z" -> "21/11/2026 12:42" (no fuso do aparelho)
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}