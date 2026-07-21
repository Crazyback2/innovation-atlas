"use client";

import CopyPromptButton from "@/app/concept/[id]/CopyPromptButton";

export default function AiHandoffBar({ prompt }: { prompt: string }) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between gap-6 bg-accent-secondary px-8 py-6">
        <h2 className="font-mono text-metadata uppercase leading-normal text-bg-elevated">
          Interpreta con la tua AI
        </h2>
        <CopyPromptButton
          prompt={prompt}
          label="Copia il prompt"
          className="shrink-0 cursor-pointer border border-bg-elevated bg-transparent px-6 py-3.5 font-sans text-body font-medium leading-normal text-bg-elevated transition-opacity duration-150 ease-out hover:opacity-90"
        />
      </div>
      <p className="px-8 font-sans text-metadata leading-normal text-fg-primary opacity-70">
        Allega anche i tre CSV scaricati sopra (CFML, SP, matrice) insieme al
        prompt.
      </p>
    </div>
  );
}
