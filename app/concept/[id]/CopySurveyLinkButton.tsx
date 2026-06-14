"use client";

import { useState } from "react";

const actionLinkClassName =
  "font-sans text-body font-medium leading-normal text-accent-primary";

export default function CopySurveyLinkButton({
  publicToken,
}: {
  publicToken: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/sp/${publicToken}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia il link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${actionLinkClassName} cursor-pointer border-none bg-transparent p-0`}
    >
      {copied ? "Link copiato ✓" : "Link pubblico ↗"}
    </button>
  );
}
