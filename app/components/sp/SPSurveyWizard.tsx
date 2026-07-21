"use client";

import { useState, useTransition } from "react";
import type {
  SPConfig,
  SPDimension,
  SPItem,
  SPMethod,
} from "@/src/data/sp-config/types";
import Button from "@/app/components/Button";
import InfoIcon from "@/app/components/InfoIcon";
import OverlayLightbox from "@/app/components/OverlayLightbox";
import StimulusPackHero from "@/app/components/sp/StimulusPackHero";
import StimulusPackView, {
  type StimulusPackData,
} from "@/app/components/sp/StimulusPackView";
import { respondentContainerClassName } from "@/app/concept/wizard-container";
import SP_CONFIG_V1 from "@/src/data/sp-config/v1_2026-06";
import { submitSPResponse } from "@/app/sp/[token]/actions";

type AnswersState = Record<string, number | string>;

type SPSurveyWizardProps = {
  pack: StimulusPackData;
  config: SPConfig;
  surveyId: string;
  token: string;
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function isItemAnswered(item: SPItem, answers: AnswersState): boolean {
  const value = answers[item.id];
  return typeof value === "number" && !Number.isNaN(value);
}

function isStepComplete(dimension: SPDimension, answers: AnswersState): boolean {
  return dimension.items.every((item) => isItemAnswered(item, answers));
}

/**
 * Istruzione da config. Se il template contiene {poleLow}/{poleHigh} e il
 * primo item ha i poli (struttura semantic differential), li interpola.
 */
function scaleInstruction(
  instruction: string,
  dimension: SPDimension
): string {
  const first = dimension.items[0];
  const hasPoles = Boolean(first?.poleLow && first?.poleHigh);

  if (!hasPoles) {
    return instruction;
  }

  return instruction
    .replaceAll("{poleLow}", first?.poleLow ?? "")
    .replaceAll("{poleHigh}", first?.poleHigh ?? "");
}

function ScaleRadios({
  itemId,
  scaleMin,
  scaleMax,
  value,
  onChange,
}: {
  itemId: string;
  scaleMin: number;
  scaleMax: number;
  value: number | undefined;
  onChange: (next: number) => void;
}) {
  const values = Array.from(
    { length: scaleMax - scaleMin + 1 },
    (_, i) => scaleMin + i
  );

  return (
    <div
      role="radiogroup"
      aria-label={`Scala da ${scaleMin} a ${scaleMax}`}
      className="flex items-center justify-center gap-4"
    >
      {values.map((scaleValue) => {
        const selected = value === scaleValue;
        const optionId = `${itemId}-${scaleValue}`;

        return (
          <label
            key={scaleValue}
            htmlFor={optionId}
            className="relative flex size-10 shrink-0 cursor-pointer items-center justify-center"
          >
            <input
              id={optionId}
              type="radio"
              name={itemId}
              value={scaleValue}
              checked={selected}
              onChange={() => onChange(scaleValue)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`size-10 rounded-full border border-fg-primary transition-colors duration-150 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-fg-primary peer-focus-visible:ring-offset-2 ${
                selected ? "bg-accent-secondary" : "bg-transparent"
              }`}
            />
            {/* Etichetta sotto: absolute così non alza la fila di cerchi rispetto ai poli */}
            <span className="pointer-events-none absolute top-[calc(100%+0.25rem)] font-mono text-metadata uppercase leading-normal text-fg-primary">
              {scaleValue}
            </span>
          </label>
        );
      })}
    </div>
  );
}

const poleClassName =
  "w-[120px] shrink-0 font-sans text-body uppercase leading-relaxed text-fg-primary";

const statementClassName =
  "font-sans text-body uppercase leading-relaxed text-fg-primary";

const itemRowClassName =
  "border border-fg-primary bg-bg-elevated px-8 py-8";

function SemanticDifferentialItem({
  item,
  scaleMin,
  scaleMax,
  value,
  onChange,
}: {
  item: SPItem;
  scaleMin: number;
  scaleMax: number;
  value: number | undefined;
  onChange: (next: number) => void;
}) {
  return (
    <div className={itemRowClassName}>
      <div className="flex items-center gap-4">
        <span className={`${poleClassName} text-right`}>{item.poleLow}</span>
        <div className="min-w-0 flex-1">
          <ScaleRadios
            itemId={item.id}
            scaleMin={scaleMin}
            scaleMax={scaleMax}
            value={value}
            onChange={onChange}
          />
        </div>
        <div className="flex w-[120px] shrink-0 items-center gap-2">
          <span className="font-sans text-body uppercase leading-relaxed text-fg-primary">
            {item.poleHigh}
          </span>
          {item.tooltip ? (
            <span className="group relative inline-flex shrink-0">
              <button
                type="button"
                aria-label={`Informazioni su ${item.poleHigh}`}
                className="cursor-help"
              >
                <InfoIcon />
              </button>
              <span
                role="tooltip"
                className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden w-[280px] border border-accent-tertiary bg-bg-elevated px-3 py-2 font-sans text-body leading-relaxed text-fg-primary shadow-sm group-hover:block group-focus-within:block"
              >
                {item.tooltip}
              </span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function LikertItem({
  item,
  scaleMin,
  scaleMax,
  value,
  openText,
  onChange,
  onOpenTextChange,
}: {
  item: SPItem;
  scaleMin: number;
  scaleMax: number;
  value: number | undefined;
  openText: string;
  onChange: (next: number) => void;
  onOpenTextChange: (next: string) => void;
}) {
  return (
    <div className={itemRowClassName}>
      <p className={statementClassName}>{item.statement}</p>
      <div className="mt-6 pb-5">
        <ScaleRadios
          itemId={item.id}
          scaleMin={scaleMin}
          scaleMax={scaleMax}
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
        <span>1 — Per niente d&apos;accordo</span>
        <span>7 — Completamente d&apos;accordo</span>
      </div>
      {item.openTextField ? (
        <div className="mt-6">
          <label
            htmlFor="R5_open"
            className="block font-sans text-body leading-normal text-fg-primary"
          >
            {item.openTextField.label}
          </label>
          <textarea
            id="R5_open"
            name="R5_open"
            rows={3}
            value={openText}
            onChange={(event) => onOpenTextChange(event.target.value)}
            placeholder={item.openTextField.placeholder}
            className="mt-2 w-full resize-y border border-accent-tertiary bg-bg-elevated px-4 py-3 font-sans text-body leading-normal text-fg-primary outline-none placeholder:text-fg-primary placeholder:opacity-50"
          />
        </div>
      ) : null}
    </div>
  );
}

function SurveyItem({
  item,
  method,
  scaleMin,
  scaleMax,
  value,
  openText,
  onChange,
  onOpenTextChange,
}: {
  item: SPItem;
  method: SPMethod;
  scaleMin: number;
  scaleMax: number;
  value: number | undefined;
  openText: string;
  onChange: (next: number) => void;
  onOpenTextChange: (next: string) => void;
}) {
  if (method === "semantic_differential") {
    return (
      <SemanticDifferentialItem
        item={item}
        scaleMin={scaleMin}
        scaleMax={scaleMax}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <LikertItem
      item={item}
      scaleMin={scaleMin}
      scaleMax={scaleMax}
      value={value}
      openText={openText}
      onChange={onChange}
      onOpenTextChange={onOpenTextChange}
    />
  );
}

export default function SPSurveyWizard({
  pack,
  config,
  surveyId,
  token,
}: SPSurveyWizardProps) {
  const dimensions = config.dimensions;
  const totalSteps = dimensions.length;

  const [phase, setPhase] = useState<"pack" | "survey">("pack");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [packLightboxOpen, setPackLightboxOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const dimension = dimensions[stepIndex];
  const isLastStep = stepIndex === totalSteps - 1;
  const stepReady = dimension ? isStepComplete(dimension, answers) : false;

  function setItemAnswer(itemId: string, value: number) {
    setAnswers((previous) => ({ ...previous, [itemId]: value }));
  }

  function setOpenText(value: string) {
    setAnswers((previous) => {
      if (!value) {
        const next = { ...previous };
        delete next.R5_open;
        return next;
      }
      return { ...previous, R5_open: value };
    });
  }

  function startSurvey() {
    setPhase("survey");
    setStepIndex(0);
    scrollToTop();
  }

  function goBack() {
    if (stepIndex === 0) {
      setPhase("pack");
      scrollToTop();
      return;
    }
    setStepIndex((previous) => previous - 1);
    scrollToTop();
  }

  function goNext() {
    if (!stepReady || isLastStep) return;
    setStepIndex((previous) => previous + 1);
    scrollToTop();
  }

  function handleSubmit() {
    if (!stepReady || !isLastStep || isPending) return;

    const formData = new FormData();
    formData.set("surveyId", surveyId);
    formData.set("token", token);

    for (const [key, value] of Object.entries(answers)) {
      if (typeof value === "string") {
        if (!value) continue;
        formData.set(key, value);
        continue;
      }
      formData.set(key, String(value));
    }

    startTransition(async () => {
      await submitSPResponse(formData);
    });
  }

  if (phase === "pack") {
    return (
      <StimulusPackView
        pack={pack}
        variant="respondent"
        onStartSurvey={startSurvey}
      />
    );
  }

  if (!dimension) {
    return null;
  }

  const openText =
    typeof answers.R5_open === "string" ? answers.R5_open : "";

  const liveDimension = SP_CONFIG_V1.dimensions.find(
    (entry) => entry.id === dimension.id
  );
  const description = liveDimension?.description ?? dimension.description;
  const instruction = scaleInstruction(
    liveDimension?.instruction ?? "",
    dimension
  );

  return (
    <div className={respondentContainerClassName}>
      <div className="flex w-full min-w-0 flex-col gap-8">
        {/* Intestazione allineata al wizard CFML */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex w-fit border border-fg-primary bg-bg-elevated pl-3 pr-2.5 pb-2 pt-2">
              <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
                {stepIndex + 1} / {totalSteps}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPackLightboxOpen(true)}
              className="cursor-pointer border-none bg-accent-secondary px-3 py-2 font-sans text-metadata font-medium uppercase leading-none text-bg-elevated transition-opacity duration-150 ease-out hover:opacity-90"
            >
              Rivedi concept
            </button>
          </div>

          <div className="border border-fg-primary bg-bg-elevated px-14 pb-6 pt-8">
            <p className="font-sans text-lead leading-normal text-fg-primary">
              Dimensione {dimension.number}
            </p>
            <h2 className="mt-7 font-heading text-h1 font-bold uppercase text-fg-primary">
              {dimension.title}
            </h2>
            {description ? (
              <p className="mt-2 font-sans text-body leading-relaxed text-fg-primary opacity-60">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <p className="text-center font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
          {instruction}
        </p>

        {/* Righe item = divider CFML (gap-2 + bordo per riga) */}
        <section className="flex flex-col gap-2">
          {dimension.items.map((item) => {
            const raw = answers[item.id];
            const value = typeof raw === "number" ? raw : undefined;
            const liveTooltip = liveDimension?.items.find(
              (entry) => entry.id === item.id
            )?.tooltip;
            const itemForUi =
              liveTooltip !== undefined
                ? { ...item, tooltip: liveTooltip }
                : item;

            return (
              <SurveyItem
                key={item.id}
                item={itemForUi}
                method={dimension.method}
                scaleMin={config.scaleMin}
                scaleMax={config.scaleMax}
                value={value}
                openText={openText}
                onChange={(next) => setItemAnswer(item.id, next)}
                onOpenTextChange={setOpenText}
              />
            );
          })}
        </section>

        <div className="flex items-center justify-between gap-4">
          <Button variant="secondary" onClick={goBack}>
            Indietro
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={!stepReady || isPending}
            >
              {isPending ? "Invio in corso…" : "Invia risposte"}
            </Button>
          ) : (
            <Button
              onClick={goNext}
              disabled={!stepReady}
              className="border-none bg-accent-secondary text-bg-elevated hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Avanti
            </Button>
          )}
        </div>
      </div>

      <OverlayLightbox
        open={packLightboxOpen}
        onClose={() => setPackLightboxOpen(false)}
        label="Rivedi concept"
      >
        <StimulusPackHero pack={pack} />
      </OverlayLightbox>
    </div>
  );
}
