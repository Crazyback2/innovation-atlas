import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ConceptStats from "@/app/components/ConceptStats";
import ConceptQuadrant from "@/app/components/ConceptQuadrant";
import CopySurveyLinkButton from "@/app/concept/[id]/CopySurveyLinkButton";
import DeleteSurveyButton from "@/app/concept/[id]/DeleteSurveyButton";
import { toConceptView } from "@/src/lib/concept-adapter";
import { loadPrivateConcept } from "@/src/lib/concept-private-source";
import { createClient } from "@/src/lib/supabase/server";

// Aggregati CFML/SP live: niente cache statica (allineato a /archivio/[id]).
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

type SurveyRow = {
  id: string;
  public_token: string;
  created_at: string;
};

type SurveyWithCount = SurveyRow & {
  responsesCount: number;
};

const IT_MONTHS_SHORT = [
  "gen",
  "feb",
  "mar",
  "apr",
  "mag",
  "giu",
  "lug",
  "ago",
  "set",
  "ott",
  "nov",
  "dic",
] as const;

const actionLinkClassName =
  "font-sans text-body font-medium leading-normal text-accent-primary";

function formatCfmlLevel(level: number | null | undefined): string {
  if (level == null) return "L0";
  return `L${level}`;
}

function formatScore(value: number): string {
  return value.toFixed(1);
}

function formatSurveyDateItalian(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = IT_MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

async function loadSurveysWithCounts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  conceptId: string
): Promise<SurveyWithCount[]> {
  const { data: surveys } = await supabase
    .from("sp_surveys")
    .select("id, public_token, created_at")
    .eq("concept_id", conceptId)
    .order("created_at", { ascending: false });

  const typedSurveys = (surveys ?? []) as SurveyRow[];

  if (typedSurveys.length === 0) {
    return [];
  }

  const surveyIds = typedSurveys.map((survey) => survey.id);
  const { data: responses } = await supabase
    .from("sp_responses")
    .select("survey_id")
    .in("survey_id", surveyIds);

  const countsBySurveyId = new Map<string, number>();

  for (const surveyId of surveyIds) {
    countsBySurveyId.set(surveyId, 0);
  }

  for (const response of responses ?? []) {
    const surveyId = response.survey_id as string;
    countsBySurveyId.set(surveyId, (countsBySurveyId.get(surveyId) ?? 0) + 1);
  }

  return typedSurveys.map((survey) => ({
    ...survey,
    responsesCount: countsBySurveyId.get(survey.id) ?? 0,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: concept } = await supabase
    .from("concepts")
    .select("title, description")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    return { title: "Concept non trovato — Innovation Atlas" };
  }

  return {
    title: `${concept.title} — Innovation Atlas`,
    description: concept.description ?? undefined,
  };
}

export default async function ConceptPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const privateConceptInput = await loadPrivateConcept(id);
  if (!privateConceptInput) {
    notFound();
  }

  const conceptView = toConceptView(privateConceptInput);
  const cfmlCompleted = conceptView.cfmlCompletedAt != null;
  const statusLabel = cfmlCompleted ? "CFML COMPILATA" : "BOZZA";

  const surveys = await loadSurveysWithCounts(supabase, conceptView.id);

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <div className="mx-auto w-full max-w-[720px] px-[var(--spacing-gutter)]">
          <header className="flex flex-col gap-4">
            <h1 className="font-heading text-display font-bold leading-normal text-fg-primary">
              {conceptView.title}
            </h1>

            <p className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              {conceptView.sector} · {statusLabel}
            </p>

            {conceptView.description ? (
              <p className="font-sans text-body leading-relaxed text-fg-primary">
                {conceptView.description}
              </p>
            ) : null}
          </header>
        </div>

        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-[var(--spacing-gutter)]">
          <ConceptStats concept={conceptView} />
          <ConceptQuadrant concept={conceptView} />
        </div>

        <div className="mx-auto mt-12 w-full max-w-[720px] px-[var(--spacing-gutter)]">
          <section className="flex flex-col gap-6">
            <h2 className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              Azioni
            </h2>

            <div className="flex flex-col gap-6">
              <Link
                href={`/concept/${conceptView.id}/edit`}
                className={actionLinkClassName}
              >
                Modifica concept →
              </Link>

              <div className="flex items-start justify-between gap-8">
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-body font-medium leading-relaxed text-fg-primary">
                    Diagnosi CFML
                  </span>
                  {cfmlCompleted ? (
                    <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                      {formatCfmlLevel(conceptView.cfmlLevelsPassed)} ·{" "}
                      {formatScore(conceptView.cfml)}/100
                    </span>
                  ) : (
                    <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                      Non ancora compilata
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-4">
                  {cfmlCompleted ? (
                    <>
                      <Link
                        href={`/concept/${conceptView.id}/cfml/results`}
                        className={actionLinkClassName}
                      >
                        Vedi risultati →
                      </Link>
                      <Link
                        href={`/concept/${conceptView.id}/cfml`}
                        className={actionLinkClassName}
                      >
                        Modifica →
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/concept/${conceptView.id}/cfml`}
                      className={actionLinkClassName}
                    >
                      Compila →
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <span className="font-heading text-body font-medium leading-relaxed text-fg-primary">
                  Symbolic Perception
                </span>

                {surveys.length === 0 ? (
                  <div className="flex flex-col gap-2">
                    <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                      Nessuna survey creata
                    </span>
                    <Link
                      href={`/concept/${conceptView.id}/sp`}
                      className={actionLinkClassName}
                    >
                      Crea survey →
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {surveys.map((survey) => (
                      <div key={survey.id} className="flex flex-col gap-2">
                        <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                          {formatSurveyDateItalian(survey.created_at)} ·{" "}
                          {survey.responsesCount}{" "}
                          {survey.responsesCount === 1
                            ? "risposta raccolta"
                            : "risposte raccolte"}
                        </span>

                        <div className="flex flex-wrap items-center gap-4">
                          <Link
                            href={`/concept/${conceptView.id}/sp/results?token=${survey.public_token}`}
                            className={actionLinkClassName}
                          >
                            Vedi risultati →
                          </Link>
                          <CopySurveyLinkButton
                            publicToken={survey.public_token}
                          />
                          <DeleteSurveyButton
                            surveyId={survey.id}
                            responsesCount={survey.responsesCount}
                          />
                        </div>
                      </div>
                    ))}

                    <Link
                      href={`/concept/${conceptView.id}/sp`}
                      className={actionLinkClassName}
                    >
                      + Nuova survey
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
