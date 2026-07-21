"use client";

import Button from "@/app/components/Button";

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
    <Button type="button" variant="secondary" onClick={handleDownload}>
      {label}
    </Button>
  );
}
