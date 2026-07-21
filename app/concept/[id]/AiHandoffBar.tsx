"use client";

import { useState } from "react";
import InfoIcon from "@/app/components/InfoIcon";
import CopyPromptButton from "@/app/concept/[id]/CopyPromptButton";

const CSV_HINT =
  "Allega anche i tre CSV scaricati sopra (CFML, SP, matrice) insieme al prompt.";

export default function AiHandoffBar({ prompt }: { prompt: string }) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="mt-[-1px] flex w-full items-center justify-between gap-6 border border-fg-primary bg-accent-secondary px-8 py-6">
      <div className="flex items-center gap-2">
        <h2 className="font-sans text-body font-medium uppercase leading-normal text-bg-elevated">
          Interpreta con la tua AI
        </h2>
        <span className="group relative inline-flex shrink-0">
          <button
            type="button"
            aria-label="Informazioni sul prompt AI"
            aria-expanded={infoOpen}
            onClick={() => setInfoOpen((prev) => !prev)}
            className="flex items-center [&_div]:border-bg-elevated [&_span]:text-bg-elevated"
          >
            <InfoIcon />
          </button>
          <span
            role="tooltip"
            className={`absolute left-0 top-full z-10 mt-2 w-[320px] border border-fg-primary bg-bg-elevated p-[12px] font-sans text-body leading-normal text-fg-primary ${
              infoOpen
                ? "block"
                : "pointer-events-none hidden group-hover:block group-focus-within:block"
            }`}
          >
            {CSV_HINT}
          </span>
        </span>
      </div>
      <CopyPromptButton
        prompt={prompt}
        label="Copia il prompt"
        className="shrink-0 cursor-pointer border border-bg-elevated bg-transparent px-6 py-3.5 font-sans text-body font-medium leading-normal text-bg-elevated transition-opacity duration-150 ease-out hover:opacity-90"
      />
    </div>
  );
}
