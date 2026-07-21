"use client";

import { Download } from "lucide-react";

export default function DownloadCsvButton({
  csv,
  filename,
  label,
}: {
  csv: string;
  filename: string;
  label: string;
}) {
  function handleDownload() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex w-full cursor-pointer items-center justify-between gap-4 border border-accent-tertiary bg-transparent px-6 py-3.5 font-sans text-body font-medium leading-normal text-fg-primary transition-colors duration-150 ease-out hover:border-fg-primary"
    >
      <span>{label}</span>
      <Download className="size-4 shrink-0" aria-hidden="true" />
    </button>
  );
}
