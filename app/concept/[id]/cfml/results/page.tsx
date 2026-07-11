import Link from "next/link";
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

function getLevelKey(level: CFMLLevel): CFMLLevelKey {
  return `L${level}` as CFMLLevelKey;
}

function formatScore(value: number): string {
  return value.toFixed(1);
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

function getStatusClassName(status: "consolidato" | "in corso" | "bloccato"): string {
  switch (status) {
    case "consolidato":
      return "text-accent-primary";
    case "in corso":
      return "text-fg-primary";
    case "bloccato":
      return "text-fg-primary opacity-40";
  }
}

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
  const consolidationLevel = (typedConcept.cfml_level ?? 0) as 0 | CFMLLevel;
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
                  <span className="text-[60px]">/100</span>
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

            <section className="flex flex-col gap-4">
              <h2 className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
                Dettaglio per livello
              </h2>
              <ul className="flex flex-col gap-3">
                {LEVELS.map((level) => {
                  const levelKey = getLevelKey(level);
                  const levelMeta = CFML_LEVELS.find(
                    (entry) => entry.level === level
                  );
                  const score = result.perLevelScores[levelKey];
                  const maxScore = CFML_WEIGHTS[levelKey];
                  const consolidated = result.levelConsolidation[levelKey];
                  const status = getLevelStatus(level, answers, consolidated);

                  return (
                    <li
                      key={level}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-accent-tertiary py-3"
                    >
                      <span className="font-heading text-body leading-relaxed text-fg-primary">
                        L{level} — {levelMeta?.title ?? LEVEL_NAMES[level]}
                      </span>
                      <span className="flex flex-wrap items-baseline gap-3">
                        <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
                          {formatScore(score)} / {maxScore}
                        </span>
                        <span
                          className={`font-mono text-metadata uppercase leading-normal ${getStatusClassName(status)}`}
                        >
                          {status}
                        </span>
                      </span>
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
