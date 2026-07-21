"use client";

import { useState } from "react";
import { READING_GUIDE } from "@/src/data/reading-guide";

/** Allineato a ConceptStats / ConceptQuadrant disattivati. */
const BOX_ACTIVE = "border border-fg-primary bg-bg-elevated";
const BOX_DISABLED = "border border-border-muted bg-bg-elevated";

const BUTTON_ACTIVE =
  "shrink-0 cursor-pointer border-none bg-accent-primary px-6 py-3.5 font-sans text-body font-medium leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-90";

const BUTTON_DISABLED =
  "shrink-0 cursor-not-allowed border border-border-muted bg-transparent px-6 py-3.5 font-sans text-body font-medium leading-normal text-fg-primary";

type Props = {
  /**
   * Se false, barra in stato disattivato (hub privata senza CFML).
   * Default true: comportamento attuale con dati.
   */
  available?: boolean;
};

export default function ReadingGuideBar({ available = true }: Props) {
  const [open, setOpen] = useState(false);
  const isOpen = available && open;

  return (
    <div
      className={`flex w-full flex-col ${available ? BOX_ACTIVE : BOX_DISABLED}`}
      aria-disabled={!available}
    >
      <div
        className={`flex w-full items-center justify-between gap-6 px-8 py-6 ${
          available ? "" : "opacity-40"
        }`}
      >
        <h2 className="font-sans text-body font-medium uppercase leading-normal text-fg-primary">
          Interpreta i risultati in autonomia
        </h2>
        <button
          type="button"
          aria-expanded={isOpen}
          disabled={!available}
          onClick={() => {
            if (!available) return;
            setOpen((prev) => !prev);
          }}
          className={available ? BUTTON_ACTIVE : BUTTON_DISABLED}
        >
          {isOpen ? "Chiudi la guida alla lettura" : "Apri la guida alla lettura"}
        </button>
      </div>

      {isOpen ? (
        <div className="flex flex-col gap-8 border-t border-fg-primary px-8 py-8">
          {READING_GUIDE.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3 className="font-heading text-body font-medium leading-relaxed text-fg-primary">
                {section.title}
              </h3>
              <p className="font-sans text-body leading-relaxed text-fg-primary">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
