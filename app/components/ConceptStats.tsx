"use client";

import type { ReactNode } from "react";
import type { Concept } from "@/src/data/concepts";
import { getCfmlBand, getSpBand } from "@/src/lib/bands";
import { formatDate, formatRange } from "@/src/lib/format";

interface Props {
  concept: Concept;
}

const EXPAND_BTN =
  "flex h-[29px] shrink-0 items-center gap-[10px] border border-fg-primary bg-bg-elevated px-[12px] pt-[8px] pb-[7px] font-mono text-metadata text-fg-primary leading-none";

const BADGE =
  "inline-flex h-[29px] items-center bg-fg-primary px-[12px] pt-[8px] pb-[7px] font-mono text-metadata font-bold text-bg-elevated leading-none";

function StatColumn({
  title,
  score,
  badge,
  metadata,
}: {
  title: ReactNode;
  score: number;
  badge: string;
  metadata: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col px-[35px] py-[32px]">
      <div className="flex items-start justify-between gap-[16px]">
        <div className="font-sans text-display-caps uppercase leading-[30px] text-fg-primary">
          {title}
        </div>
        <p className="shrink-0 font-heading text-h1 font-bold leading-[60px] text-fg-primary">
          {score}
        </p>
      </div>

      <p className="mt-[18px]">
        <span className={BADGE}>{badge}</span>
      </p>

      <div className="mt-auto flex items-end justify-between gap-[16px]">
        <div className="font-mono text-metadata leading-normal text-fg-primary">
          {metadata}
        </div>
        <button type="button" className={EXPAND_BTN}>
          Espandi ↓
        </button>
      </div>
    </div>
  );
}

export default function ConceptStats({ concept }: Props) {
  return (
    <div className="mt-[91px] flex h-[212px] w-[1160px] border border-fg-primary bg-bg-elevated">
      <StatColumn
        title={
          <>
            Concept functional
            <br />
            maturity level
          </>
        }
        score={concept.cfml}
        badge={getCfmlBand(concept.cfml)}
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
      />

      <div className="w-px shrink-0 bg-fg-primary" aria-hidden="true" />

      <StatColumn
        title={
          <>
            Symbolic
            <br />
            perception
          </>
        }
        score={concept.sp}
        badge={getSpBand(concept.sp)}
        metadata={
          <>
            <p className="font-bold uppercase">{concept.spResponses} RISPONDENTI</p>
            <p className="uppercase">
              FINESTRA DI RACCOLTA{" "}
              {formatRange(concept.spWindowStart, concept.spWindowEnd)}
            </p>
          </>
        }
      />
    </div>
  );
}
