"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Fragment } from "react";
import { CFML_LEVELS } from "@/app/concept/[id]/cfml/questions";
import {
  CFML_WEIGHTS,
  isLevelUnlocked,
  type CFMLAnswers,
  type CFMLLevel,
  type CFMLLevelKey,
  type CFMLResult,
} from "@/src/lib/scoring";

type Props = {
  perLevelScores: CFMLResult["perLevelScores"];
  levelConsolidation: CFMLResult["levelConsolidation"];
  answers: CFMLAnswers;
  conceptId?: string;
};

const LEVEL_NAMES: Record<0 | CFMLLevel, string> = {
  0: "Nessun livello consolidato",
  1: "Principio definito",
  2: "Struttura definita",
  3: "Funzione verificata",
  4: "Prototipo fisico",
  5: "Prototipo in ambiente rilevante",
  6: "Definizione e replicabilità",
};

const LEVELS: CFMLLevel[] = [1, 2, 3, 4, 5, 6];
const STEPPER_LABELS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6"] as const;

const LEVEL_DETAIL_ACTION_CLASS =
  "flex h-[29px] shrink-0 items-center gap-2.5 border border-fg-primary bg-bg-elevated pl-3 pr-2.5 pt-2 pb-[7px] font-mono text-metadata leading-none text-fg-primary transition-colors duration-150 ease-out hover:bg-accent-primary";

function getLevelKey(level: CFMLLevel): CFMLLevelKey {
  return `L${level}` as CFMLLevelKey;
}

function formatScore(value: number): string {
  return value.toFixed(1);
}

function getConsolidationLevel(
  levelConsolidation: CFMLResult["levelConsolidation"]
): 0 | CFMLLevel {
  let consolidationLevel: 0 | CFMLLevel = 0;
  for (const level of LEVELS) {
    if (!levelConsolidation[getLevelKey(level)]) {
      break;
    }
    consolidationLevel = level;
  }
  return consolidationLevel;
}

function StepperDivider({
  label,
}: {
  label: (typeof STEPPER_LABELS)[number];
}) {
  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="h-11 w-px border-l border-dashed border-border-muted" />
      <span className="mt-2 font-mono text-metadata uppercase leading-normal text-fg-primary">
        {label}
      </span>
    </div>
  );
}

function getLevelStatus(
  level: CFMLLevel,
  answers: CFMLAnswers,
  consolidated: boolean
): "consolidato" | "in corso" | "bloccato" {
  if (consolidated) {
    return "consolidato";
  }
  if (isLevelUnlocked(level, answers)) {
    return "in corso";
  }
  return "bloccato";
}

function getStatusBadgeLabel(
  status: "consolidato" | "in corso" | "bloccato",
  score: number,
  maxScore: number
): string {
  switch (status) {
    case "consolidato":
      return "superato";
    case "in corso":
      return `${formatScore(score)} / ${maxScore}`;
    case "bloccato":
      return "bloccato";
  }
}

function getStatusBadgeClassName(
  status: "consolidato" | "in corso" | "bloccato"
): string {
  const base =
    "flex h-[29px] shrink-0 items-center border border-fg-primary px-3 pt-2 pb-[7px] font-mono text-metadata uppercase leading-none text-fg-primary";

  switch (status) {
    case "consolidato":
      return `${base} bg-accent-primary`;
    case "in corso":
      return `${base} bg-bg-elevated`;
    case "bloccato":
      return `${base} bg-bg-elevated opacity-40`;
  }
}

export default function CFMLBreakdown({
  perLevelScores,
  levelConsolidation,
  answers,
  conceptId,
}: Props) {
  const consolidationLevel = getConsolidationLevel(levelConsolidation);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="font-sans text-lead leading-normal text-fg-primary">
          Livello raggiunto:
        </p>
        <h2 className="flex flex-wrap items-baseline gap-x-3 font-heading font-semibold uppercase leading-none text-fg-primary">
          <span className="text-hero">L{consolidationLevel}</span>
          <span className="text-lead">
            {LEVEL_NAMES[consolidationLevel]}
          </span>
        </h2>
      </div>

      <div className="flex min-w-0 items-start gap-2">
        <StepperDivider label="L0" />
        {LEVELS.map((level) => {
          const levelKey = getLevelKey(level);
          const consolidated = levelConsolidation[levelKey];
          const isReached =
            consolidationLevel > 0 && level === consolidationLevel;

          return (
            <Fragment key={level}>
              <div
                className={`h-11 min-w-0 flex-1 ${consolidated ? "bg-accent-primary" : "bg-bg-primary"} ${isReached ? "ring-2 ring-inset ring-fg-primary" : ""}`}
                aria-label={`Livello ${level}${
                  isReached ? ", livello raggiunto" : ""
                }`}
              />
              <StepperDivider label={STEPPER_LABELS[level]} />
            </Fragment>
          );
        })}
      </div>

      <section className="w-full min-w-0 max-w-full border-y border-dashed border-border-muted py-2">
        <ul className="flex w-full min-w-0 flex-col">
          {LEVELS.map((level) => {
            const levelKey = getLevelKey(level);
            const levelMeta = CFML_LEVELS.find(
              (entry) => entry.level === level
            );
            const score = perLevelScores[levelKey];
            const maxScore = CFML_WEIGHTS[levelKey];
            const consolidated = levelConsolidation[levelKey];
            const status = getLevelStatus(level, answers, consolidated);
            const title = levelMeta?.title ?? LEVEL_NAMES[level];

            return (
              <li
                key={level}
                className="flex w-full min-w-0 min-h-16 items-center justify-between gap-4"
              >
                <p className="min-w-0 flex-1 basis-0 font-sans text-fg-primary">
                  <span className="text-display font-medium">{`L${level}: `}</span>
                  <span className="text-body uppercase">{title}</span>
                </p>
                <div className="flex min-w-0 shrink-0 items-center gap-2.5">
                  <span
                    className={getStatusBadgeClassName(status)}
                    aria-label={`Stato livello ${level}: ${status}, punteggio ${formatScore(score)} su ${maxScore}`}
                  >
                    {getStatusBadgeLabel(status, score, maxScore)}
                  </span>
                  {conceptId ? (
                    <Link
                      href={`/concept/${conceptId}/cfml`}
                      className={LEVEL_DETAIL_ACTION_CLASS}
                    >
                      Vedi domande
                      <ChevronDown
                        className="size-3 shrink-0 -rotate-90"
                        aria-hidden
                      />
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
