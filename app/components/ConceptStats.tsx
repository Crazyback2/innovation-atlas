"use client";

import { useState, type ReactNode } from "react";
import type { Concept } from "@/src/data/concepts";
import { formatDate, formatRange } from "@/src/lib/format";
import CFMLBreakdown from "@/app/components/CFMLBreakdown";
import SPBreakdown from "@/app/components/SPBreakdown";

interface Props {
  concept: Concept;
}

const EXPAND_BTN =
  "flex h-[29px] shrink-0 items-center gap-[10px] border border-fg-primary bg-bg-elevated px-[12px] pt-[8px] pb-[7px] font-mono text-metadata text-fg-primary leading-none transition-colors duration-150 ease-out hover:bg-accent-primary";

function StatColumn({
  title,
  score,
  metadata,
  expandable,
  isOpen,
  onToggle,
  panel,
}: {
  title: ReactNode;
  score: number;
  metadata: ReactNode;
  expandable: boolean;
  isOpen: boolean;
  onToggle: () => void;
  panel?: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex min-h-[212px] flex-col px-[35px] py-[32px]">
        <div className="flex items-start justify-between gap-[16px]">
          <div className="font-sans text-display-caps uppercase leading-[30px] text-fg-primary">
            {title}
          </div>
          <p className="shrink-0 font-heading text-h1 font-bold leading-[60px] text-fg-primary">
            {score}
          </p>
        </div>

        <div className="mt-[18px] h-[29px]" aria-hidden="true" />

        <div className="mt-auto flex items-end justify-between gap-[16px]">
          <div className="font-mono text-metadata leading-normal text-fg-primary">
            {metadata}
          </div>
          {expandable && (
            <button
              type="button"
              className={EXPAND_BTN}
              aria-expanded={isOpen}
              onClick={onToggle}
            >
              {isOpen ? "Riduci ↑" : "Espandi ↓"}
            </button>
          )}
        </div>
      </div>

      {isOpen && panel && (
        <div className="min-w-0 border-t border-fg-primary p-8">{panel}</div>
      )}
    </div>
  );
}

export default function ConceptStats({ concept }: Props) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  const cfmlDetail = concept.cfmlDetail;
  const spDimensions = concept.spDimensions;

  return (
    <div className="relative mt-[91px] w-[1160px] border border-fg-primary bg-bg-elevated">
      <div className="flex items-start">
        <StatColumn
          title={
            <>
              Concept functional
              <br />
              maturity level
            </>
          }
          score={concept.cfml}
          expandable={Boolean(cfmlDetail)}
          isOpen={open}
          onToggle={toggle}
          metadata={
            <>
              <p className="font-bold uppercase">
                {concept.cfmlLevelsPassed ?? "—"} LIVELLI SU 6 SUPERATI
              </p>
              <p className="uppercase">
                CHECKLIST COMPLETATA {formatDate(concept.cfmlCompletedAt)}
              </p>
            </>
          }
          panel={
            cfmlDetail ? (
              <CFMLBreakdown
                perLevelScores={cfmlDetail.perLevelScores}
                levelConsolidation={cfmlDetail.levelConsolidation}
                answers={cfmlDetail.answers}
              />
            ) : null
          }
        />

        <StatColumn
          title={
            <>
              Symbolic
              <br />
              perception
            </>
          }
          score={concept.sp}
          expandable={Boolean(spDimensions)}
          isOpen={open}
          onToggle={toggle}
          metadata={
            <>
              <p className="font-bold uppercase">
                {concept.spResponses} RISPONDENTI
              </p>
              <p className="uppercase">
                FINESTRA DI RACCOLTA{" "}
                {formatRange(concept.spWindowStart, concept.spWindowEnd)}
              </p>
            </>
          }
          panel={
            spDimensions ? (
              <SPBreakdown
                perDimension={spDimensions}
                responseCount={concept.spResponses}
                minResponses={0}
              />
            ) : null
          }
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-fg-primary"
        aria-hidden="true"
      />
    </div>
  );
}
