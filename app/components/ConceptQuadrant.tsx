"use client";

import { useState, type ReactNode } from "react";
import type { Concept } from "@/src/data/concepts";
import { getQuadrant } from "@/src/data/concepts";
import {
  getQuadrantEvocativeLabel,
  getQuadrantGridCell,
} from "@/src/lib/quadrantLabels";
import MatrixChart from "@/app/components/MatrixChart";

interface Props {
  concept: Concept;
  /** Se passato, sostituisce positioningNotes (e il placeholder Lorem). */
  notes?: string;
  /** Se true, matrice sempre aperta e niente bottone toggle. Default: false (archivio). */
  alwaysVisible?: boolean;
  /** Slot opzionale sotto la matrice (es. download CSV). */
  matrixDownload?: ReactNode;
  /**
   * Se false, blocco e matrice in stato disattivato (hub privata in bozza).
   * Default true: comportamento attuale di /archivio.
   */
  available?: boolean;
}

const POSITION_BTN =
  "flex h-[29px] w-fit items-center gap-[10px] border border-fg-primary bg-bg-elevated px-[12px] pt-[8px] pb-[7px] font-mono text-metadata text-fg-primary leading-none transition-colors duration-150 ease-out hover:bg-accent-primary";

/** Allineato a ConceptStats: bordo attenuato, sfondo elevated, opacity solo sul contenuto. */
const BOX_ACTIVE = "border border-fg-primary bg-bg-elevated";
const BOX_DISABLED = "border border-border-muted bg-bg-elevated";

const PLACEHOLDER_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
];

const UNAVAILABLE_NOTES =
  "Posizionamento non ancora disponibile. Compila la diagnosi CFML e raccogli le risposte SP per collocare il concept sulla matrice.";

function QuadrantGrid({
  activeCell,
}: {
  activeCell: number | null;
}) {
  const cells = [0, 1, 2, 3];

  return (
    <svg
      viewBox="0 0 108 81"
      className="size-[108px] shrink-0"
      aria-hidden="true"
    >
      {cells.map((index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = col * 54 + 1;
        const y = row * 40 + 1;
        const isActive = activeCell !== null && index === activeCell;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={52}
            height={38}
            fill={isActive ? "var(--color-accent-primary)" : "transparent"}
            stroke="var(--color-bg-elevated)"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}

export default function ConceptQuadrant({
  concept,
  notes,
  alwaysVisible = false,
  matrixDownload,
  available = true,
}: Props) {
  const quadrant = getQuadrant(concept);
  const [line1, line2] = available
    ? getQuadrantEvocativeLabel(concept)
    : (["NON ANCORA", "DISPONIBILE"] as const);
  const activeCell = available ? getQuadrantGridCell(quadrant) : null;
  const paragraphs = !available
    ? [UNAVAILABLE_NOTES]
    : notes
      ? notes.split("\n\n")
      : (concept.positioningNotes?.split("\n\n") ?? PLACEHOLDER_PARAGRAPHS);

  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  // Il posizionamento richiede entrambe le coordinate: senza cfml o sp il punto
  // non è collocabile, quindi il bottone non viene reso affatto.
  const canShowPosition =
    available &&
    typeof concept.cfml === "number" &&
    typeof concept.sp === "number";
  const showMatrix = canShowPosition && (alwaysVisible || open);
  const showToggle = canShowPosition && !alwaysVisible;

  return (
    <div
      className={`mt-[-1px] w-[1160px] ${available ? BOX_ACTIVE : BOX_DISABLED}`}
      aria-disabled={!available}
    >
      <div className={available ? undefined : "opacity-40"}>
        <div className="flex h-[194px]">
          <div className="flex w-[455px] shrink-0 flex-col px-[35px] py-[32px]">
            <div className="flex items-start gap-[17px]">
              <div className="relative flex h-[81px] w-[108px] shrink-0 items-center justify-center bg-fg-primary">
                <QuadrantGrid activeCell={activeCell} />
                <span className="pointer-events-none absolute font-sans text-display font-light uppercase leading-[60px] text-bg-elevated">
                  {available ? quadrant : "—"}
                </span>
              </div>

              <div className="font-sans text-display-caps uppercase leading-[28px] text-fg-primary">
                {line1}
                <br />
                {line2}
              </div>
            </div>

            {showToggle && (
              <button
                type="button"
                className={`${POSITION_BTN} mt-auto`}
                aria-expanded={open}
                onClick={toggle}
              >
                {open
                  ? "Nascondi il posizionamento ↑"
                  : "Guarda il posizionamento ↓"}
              </button>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-center px-[35px] py-[32px]">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`font-sans text-body leading-normal text-fg-primary ${
                  index > 0 ? "mt-[16px]" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {showMatrix && (
          <div className="flex flex-col gap-8 border-t border-fg-primary p-8">
            <MatrixChart concepts={[concept]} singleConcept />
            {matrixDownload ?? null}
          </div>
        )}
      </div>
    </div>
  );
}
