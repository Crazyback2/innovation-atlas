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
    <p className="font-mono text-metadata uppercase leading-normal text-accent-secondary">
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

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "CARICHI IL CONCEPT",
    description:
      "Carichi le informazioni inerenti il tuo concept come titolo, descrizione, immagini e categoria.",
  },
  {
    number: "02",
    title: "COMPILI LA CFML",
    description:
      "Rispondi alla checklist di autovalutazione per misurare quanto il tuo concept è pronto a livello tecnico.",
  },
  {
    number: "03",
    title: "DISTRIBUISCI LA SP",
    description:
      "Genera il sondaggio e condividilo per capire come le persone percepirebbero il tuo prodotto.",
  },
  {
    number: "04",
    title: "MAPPATURA",
    description:
      "Ottieni la posizione nella matrice, punteggi per dimensione, profilo simbolico e direzione futura di lavoro.",
  },
] as const;

const HOW_IT_WORKS_GRID_W = 502 + 57 + 502; // 1061
const HOW_IT_WORKS_GRID_H = 163 + 48 + 163; // 374

function HowItWorksStepBox({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative h-[163px] w-[502px] border border-fg-primary bg-bg-elevated">
      <p className="absolute left-[27px] top-[50px] font-heading text-h1 font-bold uppercase leading-[60px] text-fg-primary">
        {number}
      </p>
      <p className="absolute left-[150px] top-[20px] w-[313px] font-sans text-display-caps uppercase leading-[60px] text-fg-primary">
        {title}
      </p>
      <p className="absolute left-[150px] top-[70px] w-[309px] font-sans text-body leading-normal text-fg-primary">
        {description}
      </p>
    </div>
  );
}

function HowItWorksConnectorLines() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 text-fg-primary"
      width={HOW_IT_WORKS_GRID_W}
      height={HOW_IT_WORKS_GRID_H}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M251 163 V211"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <path
        d="M810 163 V211"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <path
        d="M502 293 H531 V85 H559"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

function HowItWorksPanel() {
  return (
    <div
      className="relative mt-2"
      style={{ width: HOW_IT_WORKS_GRID_W, height: HOW_IT_WORKS_GRID_H }}
    >
      <div
        className="grid grid-cols-2 gap-x-[57px] gap-y-[48px]"
        style={{ width: HOW_IT_WORKS_GRID_W }}
      >
        <HowItWorksStepBox {...HOW_IT_WORKS_STEPS[0]} />
        <HowItWorksStepBox {...HOW_IT_WORKS_STEPS[2]} />
        <HowItWorksStepBox {...HOW_IT_WORKS_STEPS[1]} />
        <HowItWorksStepBox {...HOW_IT_WORKS_STEPS[3]} />
      </div>
      <HowItWorksConnectorLines />
    </div>
  );
}

function ComeFunzionaButton() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="mt-4 inline-flex h-[29px] items-center gap-2 border border-fg-primary bg-bg-elevated px-3 font-sans text-body uppercase leading-normal text-fg-primary transition-colors duration-150 ease-out hover:bg-accent-primary"
      >
        <span>Come funziona?</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3 w-3 shrink-0 transition-transform duration-150 ${expanded ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {expanded && <HowItWorksPanel />}
    </>
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
