import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Fragment } from "react";
import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import CreateSPSurveyButton from "./CreateSPSurveyButton";
import { CFML_LEVELS } from "../questions";
import { createClient } from "@/src/lib/supabase/server";
import {
  calculateCFML,
  CFML_WEIGHTS,
  isLevelUnlocked,
  type CFMLAnswers,
  type CFMLLevel,
  type CFMLLevelKey,
} from "@/src/lib/scoring";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ConceptRow = {
  id: string;
  title: string;
  owner_id: string;
  cfml_answers: CFMLAnswers | null;
  cfml_score: number | null;
  cfml_level: number | null;
  cfml_completed_at: string | null;
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
const SCORE_SEGMENT_COUNT = 20;
const STEPPER_LABELS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6"] as const;

function getLevelKey(level: CFMLLevel): CFMLLevelKey {
  return `L${level}` as CFMLLevelKey;
}

function formatScore(value: number): string {
  return value.toFixed(1);
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

const LEVEL_DETAIL_ACTION_CLASS =
  "flex h-[29px] shrink-0 items-center gap-2.5 border border-fg-primary bg-bg-elevated pl-3 pr-2.5 pt-2 pb-[7px] font-mono text-metadata leading-none text-fg-primary transition-colors duration-150 ease-out hover:bg-accent-primary";

function getInterpretiveMessage(level: 0 | CFMLLevel): string {
  if (level === 6) {
    return "Il quadro di funzionamento del concept è pienamente consolidato.";
  }
  if (level === 0) {
    return "Il principio del concept non è ancora consolidato.";
  }
  return `Per progredire, consolida il livello ${level + 1}.`;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: concept } = await supabase
    .from("concepts")
    .select("title")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  return {
    title: concept
      ? `Risultati CFML — ${concept.title} — Innovation Atlas`
      : "Risultati CFML — Innovation Atlas",
  };
}

export default async function CFMLResultsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: concept } = await supabase
    .from("concepts")
    .select(
      "id, title, owner_id, cfml_answers, cfml_score, cfml_level, cfml_completed_at"
    )
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    redirect("/concept");
  }

  const typedConcept = concept as ConceptRow;

  if (typedConcept.owner_id !== user.id) {
    redirect("/concept");
  }

  if (!typedConcept.cfml_completed_at) {
    redirect(`/concept/${id}/cfml`);
  }

  if (!typedConcept.cfml_answers) {
    redirect(`/concept/${id}/cfml`);
  }

  const answers = typedConcept.cfml_answers;
  const result = calculateCFML(answers);
  const consolidationLevel = (typedConcept.cfml_level ??
    result.level) as 0 | CFMLLevel;
  const displayScore = typedConcept.cfml_score ?? result.score;
  const filledScoreSegments = Math.round(
    (displayScore / 100) * SCORE_SEGMENT_COUNT
  );

  const { data: existingSurvey } = await supabase
    .from("sp_surveys")
    .select("id")
    .eq("concept_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <div className="mx-auto w-full min-w-0 max-w-[890px] px-6 lg:px-0">
          <div className="flex w-full min-w-0 flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="inline-flex w-fit border border-fg-primary bg-bg-elevated pl-3 pr-2.5 pb-2 pt-2">
                <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
                  CONCEPT FUNCTIONAL MATURITY LEVEL
                </span>
              </div>

              <div className="border border-fg-primary bg-bg-elevated px-14 pb-8 pt-8">
                <p className="font-sans text-lead leading-normal text-fg-primary">
                  Punteggio totale:
                </p>
                <p className="mt-2 font-heading font-semibold leading-[60px] text-fg-primary">
                  <span className="text-hero">{formatScore(displayScore)}</span>
                  <span className="text-h1">/100</span>
                </p>
                <div
                  className="mt-8 flex h-[107px] min-w-0 gap-1"
                  role="img"
                  aria-label={`Punteggio ${formatScore(displayScore)} su 100`}
                >
                  {Array.from({ length: SCORE_SEGMENT_COUNT }, (_, index) => (
                    <div
                      key={index}
                      className={`min-w-0 flex-1 ${
                        index < filledScoreSegments
                          ? "bg-accent-primary"
                          : "bg-bg-primary"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="border border-fg-primary bg-bg-elevated px-14 pb-6 pt-8">
              <p className="font-sans text-lead leading-normal text-fg-primary">
                Livello raggiunto:
              </p>
              <h2 className="mt-2 font-heading font-semibold uppercase leading-[60px] text-fg-primary">
                <span className="text-hero">L{consolidationLevel}</span>{" "}
                <span className="text-display">
                  {LEVEL_NAMES[consolidationLevel]}
                </span>
              </h2>

              <div className="mt-6">
                <div className="flex min-w-0 items-start gap-2">
                  <StepperDivider label="L0" />
                  {LEVELS.map((level) => {
                    const levelKey = getLevelKey(level);
                    const consolidated = result.levelConsolidation[levelKey];
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
              </div>
            </div>

            <section className="w-full min-w-0 max-w-full border-y border-fg-primary py-6">
              <ul className="flex w-full min-w-0 flex-col">
                {LEVELS.map((level) => {
                  const levelKey = getLevelKey(level);
                  const levelMeta = CFML_LEVELS.find(
                    (entry) => entry.level === level
                  );
                  const score = result.perLevelScores[levelKey];
                  const maxScore = CFML_WEIGHTS[levelKey];
                  const consolidated = result.levelConsolidation[levelKey];
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
                        <Link
                          href={`/concept/${typedConcept.id}/cfml`}
                          className={LEVEL_DETAIL_ACTION_CLASS}
                        >
                          Vedi domande
                          <ChevronDown
                            className="size-3 shrink-0 -rotate-90"
                            aria-hidden
                          />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <p className="max-w-[640px] font-sans text-body leading-relaxed text-fg-primary opacity-75">
              {getInterpretiveMessage(consolidationLevel)}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/concept/${typedConcept.id}/cfml`}
                className="border border-accent-tertiary bg-transparent px-6 py-[14px] font-sans text-body font-medium leading-normal text-fg-primary transition-colors duration-150 ease-out hover:border-fg-primary"
              >
                Modifica risposte
              </Link>
              <Link
                href={`/concept/${typedConcept.id}`}
                className="bg-fg-primary px-6 py-[14px] font-sans text-body font-medium leading-normal text-bg-primary transition-opacity duration-150 ease-out hover:opacity-90"
              >
                Torna al concept
              </Link>
            </div>

            {/* TODO: rimuovere quando esiste UI dedicata SP nella pagina concept */}
            {existingSurvey ? (
              <div className="border-t border-accent-tertiary pt-8">
                <Link
                  href={`/concept/${typedConcept.id}`}
                  className="font-sans text-body font-medium leading-normal text-accent-primary"
                >
                  Vedi azioni del concept →
                </Link>
              </div>
            ) : (
              <div className="border-t border-accent-tertiary pt-8">
                <p className="mb-4 font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
                  Test SP (provvisorio)
                </p>
                <CreateSPSurveyButton conceptId={typedConcept.id} />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
