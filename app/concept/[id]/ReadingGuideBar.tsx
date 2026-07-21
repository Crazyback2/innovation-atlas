"use client";

import { useState } from "react";
import { READING_GUIDE } from "@/src/data/reading-guide";

export default function ReadingGuideBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full items-center justify-between gap-6 bg-bg-elevated px-8 py-6">
        <h2 className="font-mono text-metadata uppercase leading-normal text-fg-primary">
          Interpreta i risultati in autonomia
        </h2>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="shrink-0 cursor-pointer border-none bg-accent-primary px-6 py-3.5 font-sans text-body font-medium leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-90"
        >
          {open ? "Chiudi la guida alla lettura" : "Apri la guida alla lettura"}
        </button>
      </div>

      {open ? (
        <div className="flex flex-col gap-8 border border-t-0 border-accent-tertiary bg-bg-elevated px-8 py-8">
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
