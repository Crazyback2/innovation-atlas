"use client";

import { Fragment, useState } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  CFML_LEVEL_QUESTIONS,
  isLevelUnlocked,
  type CFMLAnswer,
  type CFMLAnswers,
  type CFMLLevel,
  type CFMLLevelKey,
} from "@/src/lib/scoring";
import Button from "@/app/components/Button";
import { submitCFML } from "./actions";
import { CFML_LEVELS } from "./questions";

export const defaultAllNo: CFMLAnswers = {
  "1A": "no",
  "1B": "no",
  "2A": "no",
  "2B": "no",
  "2C": "no",
  "3A": "no",
  "3B": "no",
  "3C": "no",
  "4A": "no",
  "4B": "no",
  "5A": "no",
  "5B": "no",
  "5C": "no",
  "6A": "no",
  "6B": "no",
  "6C": "no",
};

type CFMLWizardProps = {
  conceptId: string;
  initialAnswers: Partial<CFMLAnswers>;
};

type SegmentBaseState = "consolidated" | "waiting" | "empty";

const ANSWER_OPTIONS: { value: CFMLAnswer; label: string }[] = [
  { value: "no", label: "No" },
  { value: "partial", label: "Parzialmente" },
  { value: "yes", label: "Sì" },
];

const LEVELS: CFMLLevel[] = [1, 2, 3, 4, 5, 6];

const STEPPER_LABELS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6"] as const;

function getLevelKey(level: CFMLLevel): CFMLLevelKey {
  return `L${level}` as CFMLLevelKey;
}

function countYesInLevel(
  level: CFMLLevel,
  answers: Partial<CFMLAnswers>
): number {
  const questions = CFML_LEVEL_QUESTIONS[getLevelKey(level)];
  return questions.reduce(
    (count, question) => (answers[question] === "yes" ? count + 1 : count),
    0
  );
}

function isLevelConsolidated(
  level: CFMLLevel,
  answers: Partial<CFMLAnswers>
): boolean {
  return countYesInLevel(level, answers) >= 2;
}

function hasAnyAnswerInLevel(
  level: CFMLLevel,
  answers: Partial<CFMLAnswers>
): boolean {
  const questions = CFML_LEVEL_QUESTIONS[getLevelKey(level)];
  return questions.some((question) => answers[question] !== undefined);
}

function isLevelGloballyConsolidated(
  level: CFMLLevel,
  answers: Partial<CFMLAnswers>
): boolean {
  if (level === 6) {
    return countYesInLevel(level, answers) >= 2;
  }
  return isLevelUnlocked((level + 1) as CFMLLevel, answers);
}

function getSegmentBaseState(
  level: CFMLLevel,
  answers: Partial<CFMLAnswers>
): SegmentBaseState {
  const accessible = isLevelUnlocked(level, answers);
  const globallyConsolidated = isLevelGloballyConsolidated(level, answers);

  if (accessible && globallyConsolidated) {
    return "consolidated";
  }
  if (!accessible && hasAnyAnswerInLevel(level, answers)) {
    return "waiting";
  }
  return "empty";
}

function isSegmentClickable(
  level: CFMLLevel,
  currentLevel: CFMLLevel,
  answers: Partial<CFMLAnswers>
): boolean {
  return isLevelUnlocked(level, answers) || level === currentLevel;
}

function getSegmentClassName(
  baseState: SegmentBaseState,
  isCurrent: boolean
): string {
  let base: string;
  switch (baseState) {
    case "consolidated":
      base = "bg-accent-primary";
      break;
    case "waiting":
      base = "bg-bg-primary";
      break;
    case "empty":
      base = "bg-bg-primary";
      break;
  }
  return isCurrent ? `${base} ring-2 ring-inset ring-fg-primary` : base;
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

export default function CFMLWizard({
  conceptId,
  initialAnswers,
}: CFMLWizardProps) {
  const [answers, setAnswers] =
    useState<Partial<CFMLAnswers>>(initialAnswers);
  const [currentLevel, setCurrentLevel] = useState<CFMLLevel>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentLevelData = CFML_LEVELS.find(
    (level) => level.level === currentLevel
  );

  if (!currentLevelData) {
    return null;
  }

  const currentLevelConsolidated = isLevelConsolidated(currentLevel, answers);
  const currentLevelAccessible = isLevelUnlocked(currentLevel, answers);
  const showForwardButton = currentLevel < 6;
  const showCalculateButton =
    !currentLevelConsolidated || currentLevel === 6;

  function handleAnswerChange(code: keyof CFMLAnswers, value: CFMLAnswer) {
    setAnswers((previous) => ({ ...previous, [code]: value }));
  }

  async function handleCalculate() {
    setSubmitting(true);
    setSubmitError(null);

    const filled: CFMLAnswers = { ...defaultAllNo, ...answers };

    try {
      await submitCFML({ conceptId, answers: filled });
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Si è verificato un errore imprevisto. Riprova."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="inline-flex w-fit border border-fg-primary bg-bg-elevated pl-3 pr-2.5 pb-2 pt-2">
          <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
            CONCEPT FUNCTIONAL MATURITY LEVEL
          </span>
        </div>

        <div className="border border-fg-primary bg-bg-elevated px-14 pb-6 pt-8">
          <p className="font-sans text-lead leading-normal text-fg-primary">
            Livello {currentLevelData.level}
          </p>
          <h2 className="mt-7 font-heading text-h1 font-bold uppercase text-fg-primary">
            {currentLevelData.title}
          </h2>
          {currentLevelData.levelTooltip && (
            <p className="mt-2 font-sans text-body leading-relaxed text-fg-primary opacity-60">
              {currentLevelData.levelTooltip}
            </p>
          )}

          <div className="mt-6">
            <div className="flex items-start gap-2">
              <StepperDivider label="L0" />
              {LEVELS.map((level) => {
                const baseState = getSegmentBaseState(level, answers);
                const isCurrent = level === currentLevel;
                const clickable = isSegmentClickable(
                  level,
                  currentLevel,
                  answers
                );

                return (
                  <Fragment key={level}>
                    <button
                      type="button"
                      disabled={!clickable}
                      onClick={() => {
                        if (clickable) {
                          setCurrentLevel(level);
                        }
                      }}
                      className={`h-11 min-w-0 flex-1 transition-colors duration-150 ease-out ${getSegmentClassName(baseState, isCurrent)} ${
                        clickable
                          ? "cursor-pointer enabled:hover:bg-accent-primary"
                          : "cursor-not-allowed"
                      }`}
                      aria-label={`Livello ${level}`}
                      aria-current={isCurrent ? "step" : undefined}
                    />
                    <StepperDivider label={STEPPER_LABELS[level]} />
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-8">
        {!currentLevelAccessible && (
          <div className="mb-10 border-l-4 border-fg-primary border-t border-r border-b border-accent-tertiary bg-bg-elevated p-6">
            <p className="mb-2 font-mono text-metadata font-semibold uppercase leading-normal text-fg-primary">
              Accesso bloccato
            </p>
            <p className="font-sans text-body leading-relaxed text-fg-primary opacity-75">
              Non hai consolidato il livello precedente (servono almeno due
              &apos;Sì&apos;). Puoi visionare le domande in modalità sola
              lettura, oppure calcolare subito il risultato.
            </p>
          </div>
        )}

        <div
          className={`flex flex-col gap-2 ${!currentLevelAccessible ? "opacity-40" : ""}`}
        >
          {currentLevelData.questions.map((question) => {
            const code = question.code as keyof CFMLAnswers;
            const selected = answers[code];

            return (
              <div
                key={question.code}
                className="flex items-center justify-between gap-4 border border-fg-primary bg-bg-elevated px-8 py-8"
              >
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <p className="font-sans text-body uppercase leading-relaxed text-fg-primary">
                    <span className="text-accent-secondary">
                      {question.code}.
                    </span>{" "}
                    {question.text}
                  </p>
                  {question.tooltip && (
                    <span className="group relative shrink-0">
                      <button
                        type="button"
                        aria-label={`Informazioni su ${question.code}`}
                        className="flex h-5 w-5 cursor-help items-center justify-center rounded-full border border-accent-tertiary font-mono text-metadata leading-none text-fg-primary transition-colors duration-150 ease-out hover:border-fg-primary focus-visible:border-fg-primary focus-visible:outline-none"
                      >
                        i
                      </button>
                      <span
                        role="tooltip"
                        className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden w-72 border border-accent-tertiary bg-bg-elevated px-3 py-2 font-sans text-body leading-relaxed text-fg-primary shadow-sm group-hover:block group-focus-within:block"
                      >
                        {question.tooltip}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  {ANSWER_OPTIONS.map((option) => {
                    const isSelected = selected === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={!currentLevelAccessible}
                        onClick={() => {
                          if (currentLevelAccessible) {
                            handleAnswerChange(code, option.value);
                          }
                        }}
                        className={`h-11 shrink-0 px-4 font-sans text-body font-semibold leading-normal transition-colors duration-150 ease-out ${
                          !currentLevelAccessible
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        } ${
                          isSelected
                            ? "bg-accent-primary text-fg-primary"
                            : currentLevelAccessible
                              ? "bg-bg-primary text-fg-primary hover:bg-accent-primary"
                              : "bg-bg-primary text-fg-primary"
                        }`}
                        aria-pressed={isSelected}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex items-center justify-between gap-4">
        {currentLevel > 1 ? (
          <Button
            variant="secondary"
            onClick={() =>
              setCurrentLevel((previous) => (previous - 1) as CFMLLevel)
            }
          >
            Indietro
          </Button>
        ) : (
          <span />
        )}

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            {showForwardButton && (
              <Button
                onClick={() =>
                  setCurrentLevel((previous) => (previous + 1) as CFMLLevel)
                }
              >
                Avanti
              </Button>
            )}
            {showCalculateButton && (
              <Button onClick={handleCalculate} disabled={submitting}>
                {submitting ? "Calcolo in corso…" : "Calcola risultato"}
              </Button>
            )}
          </div>
          {submitError && (
            <p className="font-sans text-body leading-normal text-error">
              {submitError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
