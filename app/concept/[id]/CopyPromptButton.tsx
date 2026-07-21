"use client";

import { useState } from "react";

export default function CopyPromptButton({
  prompt,
  label = "COPIA PROMPT",
  className,
}: {
  prompt: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia il prompt:", prompt);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        className ??
        "cursor-pointer border-none bg-transparent p-0 font-sans text-body font-medium leading-normal text-accent-primary"
      }
    >
      {copied ? "Prompt copiato ✓" : label}
    </button>
  );
}
