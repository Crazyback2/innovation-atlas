export function sanitizeFilename(name: string): string {
  const sanitized = name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9.-]/g, "")
    .toLowerCase();

  return sanitized || "file";
}
