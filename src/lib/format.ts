function parseIso(iso?: string): { d: number; m: number; y: number } | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { d, m, y };
}

export function formatDate(iso?: string): string {
  const parsed = parseIso(iso);
  if (!parsed) return "—";
  const { d, m, y } = parsed;
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

export function formatRange(start?: string, end?: string): string {
  const s = parseIso(start);
  const e = parseIso(end);
  if (!s || !e) return "—";

  const sd = String(s.d).padStart(2, "0");
  const sm = String(s.m).padStart(2, "0");
  const ed = String(e.d).padStart(2, "0");
  const em = String(e.m).padStart(2, "0");

  if (s.m === e.m && s.y === e.y) {
    return `${sd}-${ed}.${sm}.${e.y}`;
  }

  return `${sd}.${sm}-${ed}.${em}.${e.y}`;
}
