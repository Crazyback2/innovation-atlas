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
        <div className="mx-auto w-full max-w-[var(--container-page)] px-[var(--spacing-gutter)]">
          <h1 className="font-heading text-display font-bold leading-normal text-fg-primary">
            {typedConcept.title}
          </h1>

          <section className="mt-10 flex flex-col gap-2">
            <h2 className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              Livello di consolidamento
            </h2>
            <p className="font-heading text-lead font-semibold leading-normal text-fg-primary">
              L{consolidationLevel} — {LEVEL_NAMES[consolidationLevel]}
            </p>
          </section>

          <section className="mt-8 flex flex-col gap-2">
            <h2 className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              Punteggio
            </h2>
            <p className="font-heading text-lead font-semibold leading-normal text-fg-primary">
              {formatScore(displayScore)} / 100
            </p>
          </section>

          <section className="mt-10 flex flex-col gap-4">
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

          <p className="mt-10 max-w-[640px] font-sans text-body leading-relaxed text-fg-primary opacity-75">
            {getInterpretiveMessage(consolidationLevel)}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
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
            <div className="mt-12 pt-8 border-t border-accent-tertiary">
              <Link
                href={`/concept/${typedConcept.id}`}
                className="font-sans text-body font-medium leading-normal text-accent-primary"
              >
                Vedi azioni del concept →
              </Link>
            </div>
          ) : (
            <div className="mt-12 pt-8 border-t border-accent-tertiary">
              <p className="mb-4 font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
                Test SP (provvisorio)
              </p>
              <CreateSPSurveyButton conceptId={typedConcept.id} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
