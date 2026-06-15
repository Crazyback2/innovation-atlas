"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ArchiveConceptCard,
  CONCEPT_CARD_GRID_W,
} from "@/app/components/CardGrid";
import type { ArchiveConceptCardData } from "@/app/components/CardGrid";
import type { ConceptPhase, ConceptsByPhase } from "./concept-phases";

const newConceptLinkClassName =
  "inline-flex h-[46px] w-[218px] min-w-[218px] flex-none items-center justify-center border border-fg-primary bg-accent-secondary font-sans text-body uppercase leading-normal whitespace-nowrap text-bg-elevated";

type SectionConfig = {
  title: string;
  description: string;
  tooltip?: string;
};

const SECTIONS: SectionConfig[] = [
  {
    title: "BOZZE",
    description: "[concept in attesa di compilazione della CFML]",
  },
  {
    title: "PRONTI PER LA VALIDAZIONE",
    description: "[CFML compilata, validazione SP non ancora avviata]",
  },
  {
    title: "VALIDAZIONE IN CORSO",
    description: "[SP attiva, raccolta risposte in corso]",
    tooltip:
      "I concept in questa fase hanno una SP attiva ma non hanno ancora raccolto le 10 risposte necessarie per essere mappati.",
  },
  {
    title: "MAPPATI",
    description:
      "[valutazione completa, concept visibile nell'archivio pubblico]",
    tooltip:
      "I concept mappati hanno raggiunto la soglia di risposte e sono visibili nell'archivio pubblico.",
  },
];

const PHASE_ORDER = [
  "drafts",
  "ready",
  "validating",
  "mapped",
] as const satisfies readonly ConceptPhase[];

function ConceptCounter({ count }: { count: number }) {
  return (
    <p className="font-mono text-metadata uppercase leading-normal text-fg-primary">
      {count} CONCEPT
    </p>
  );
}

function SectionInfoIcon({ tooltip }: { tooltip: string }) {
  return (
    <span className="group relative inline-flex shrink-0">
      <button
        type="button"
        aria-label="Informazioni sulla sezione"
        className="flex h-[18px] w-[18px] cursor-help items-center justify-center rounded-full border border-accent-secondary"
      >
        <span className="font-mono text-[11px] leading-none text-accent-secondary">
          i
        </span>
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-[280px] border border-accent-tertiary bg-bg-elevated px-3 py-2 font-heading text-[13px] leading-relaxed text-fg-primary shadow-sm group-hover:block group-focus-within:block"
      >
        {tooltip}
      </span>
    </span>
  );
}

function ComeFunzionaButton() {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      aria-expanded={expanded}
      className="mt-4 inline-flex h-[29px] items-center gap-2 border border-fg-primary bg-bg-elevated px-3 font-sans text-body uppercase leading-normal text-fg-primary"
    >
      <span>Come funziona?</span>
      <ChevronDown
        aria-hidden="true"
        className={`h-3 w-3 shrink-0 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
        strokeWidth={2}
      />
    </button>
  );
}

function DashboardSection({
  section,
  concepts,
}: {
  section: SectionConfig;
  concepts: ArchiveConceptCardData[];
}) {
  const count = concepts.length;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <div className="flex flex-wrap items-baseline gap-y-1">
          <h2 className="font-sans text-display-caps uppercase text-fg-primary">
            {section.title}
          </h2>
          <span className="ml-[12px] font-sans text-body uppercase leading-normal text-fg-primary">
            {section.description}
          </span>
          {section.tooltip && (
            <span className="ml-[8px] inline-flex">
              <SectionInfoIcon tooltip={section.tooltip} />
            </span>
          )}
        </div>

        <div className="-mt-[7px] border-t border-dashed border-fg-primary" />
      </div>

      <ConceptCounter count={count} />

      {count > 0 && (
        <div
          className="grid grid-cols-4 gap-[24px]"
          style={{ width: CONCEPT_CARD_GRID_W }}
        >
          {concepts.map((concept) => (
            <ArchiveConceptCard key={concept.id} concept={concept} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function ConceptDashboard({
  conceptsByPhase,
}: {
  conceptsByPhase: ConceptsByPhase;
}) {
  return (
    <div className="mx-auto w-full max-w-[var(--container-page)] px-[var(--spacing-gutter)]">
      <div>
        <div className="flex items-center justify-between gap-8">
          <h1 className="font-heading text-hero font-bold uppercase leading-[80px] text-fg-primary">
            I MIEI CONCEPT
          </h1>

          <Link href="/concept/new" className={newConceptLinkClassName}>
            + NUOVO CONCEPT
          </Link>
        </div>

        <ComeFunzionaButton />
      </div>

      <div className="mt-16 flex flex-col gap-[76px]">
        {SECTIONS.map((section, index) => (
          <DashboardSection
            key={section.title}
            section={section}
            concepts={conceptsByPhase[PHASE_ORDER[index]]}
          />
        ))}
      </div>
    </div>
  );
}
