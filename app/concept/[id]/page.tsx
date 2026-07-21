import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ConceptStats from "@/app/components/ConceptStats";
import ConceptQuadrant from "@/app/components/ConceptQuadrant";
import CopySurveyLinkButton from "@/app/concept/[id]/CopySurveyLinkButton";
import DeleteSurveyButton from "@/app/concept/[id]/DeleteSurveyButton";
import DeleteConceptButton from "@/app/concept/[id]/DeleteConceptButton";
import DownloadCsvButton from "@/app/concept/[id]/DownloadCsvButton";
import ReadingGuideBar from "@/app/concept/[id]/ReadingGuideBar";
import AiHandoffBar from "@/app/concept/[id]/AiHandoffBar";
import { CONCEPT_CARD_GRID_W } from "@/app/components/CardGrid";
import {
  getQuadrant,
  REAL_CONCEPT_SLUG_TO_UUID,
} from "@/src/data/concepts";
import { buildAiHandoffPrompt } from "@/src/lib/ai-handoff";
import { toConceptView } from "@/src/lib/concept-adapter";
import { loadPrivateConcept } from "@/src/lib/concept-private-source";
import {
  buildCsvExportMeta,
  exportCfmlCsv,
  exportMatriceCsv,
  exportSpCsv,
} from "@/src/lib/csv-export";
import { getPrivateQuadrantCopy } from "@/src/lib/quadrant-copy";
import { sanitizeFilename } from "@/src/lib/sanitize-filename";
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

const secondaryActionButtonClassName =
  "inline-flex w-[200px] shrink-0 items-center justify-center border border-fg-primary bg-transparent px-6 py-3.5 font-sans text-body font-medium leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-90";

const actionRowClassName =
  "grid min-h-[108px] w-full grid-cols-[1fr_200px] items-center gap-6 px-8 py-6";

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

function conceptExportSlug(conceptId: string, title: string): string {
  const entry = Object.entries(REAL_CONCEPT_SLUG_TO_UUID).find(
    ([, uuid]) => uuid === conceptId
  );
  if (entry) {
    return entry[0];
  }
  return sanitizeFilename(title);
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
  const privateQuadrantNotes = getPrivateQuadrantCopy(
    getQuadrant(conceptView),
    conceptView.cfml,
    conceptView.sp
  );

  const surveys = await loadSurveysWithCounts(supabase, conceptView.id);
  const latestSurvey = surveys[0] ?? null;

  const csvMeta = buildCsvExportMeta({
    conceptName: conceptView.title,
    surveyId: privateConceptInput.surveyId,
    spConfigVersion: privateConceptInput.spConfig?.version ?? null,
  });
  const exportSlug = conceptExportSlug(conceptView.id, conceptView.title);

  const cfmlCsv =
    cfmlCompleted &&
    privateConceptInput.cfmlAnswers &&
    privateConceptInput.cfmlResult
      ? exportCfmlCsv(
          csvMeta,
          privateConceptInput.cfmlAnswers,
          privateConceptInput.cfmlResult
        )
      : null;

  const spCsv =
    privateConceptInput.spAggregate &&
    privateConceptInput.spConfig &&
    privateConceptInput.spResponseAnswers.length > 0
      ? exportSpCsv(
          csvMeta,
          privateConceptInput.spConfig,
          privateConceptInput.spResponseAnswers,
          privateConceptInput.spAggregate
        )
      : null;

  const matriceCsv =
    cfmlCsv && spCsv
      ? exportMatriceCsv(csvMeta, {
          cfml: conceptView.cfml,
          sp: conceptView.sp,
          quadrant: getQuadrant(conceptView),
          spResponses: conceptView.spResponses,
          quadrantReading: privateQuadrantNotes,
        })
      : null;

  const aiHandoffPrompt =
    cfmlCompleted &&
    privateConceptInput.spAggregate &&
    privateConceptInput.spResponseAnswers.length > 0 &&
    privateConceptInput.surveyCreatedAt
      ? buildAiHandoffPrompt(conceptView, {
          collectedAt: privateConceptInput.surveyCreatedAt,
        })
      : null;

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
          <ConceptStats
            concept={conceptView}
            defaultOpen
            cfmlDownload={
              cfmlCsv ? (
                <DownloadCsvButton
                  csv={cfmlCsv}
                  filename={`${exportSlug}-cfml.csv`}
                  label="SCARICA REPORT CFML"
                />
              ) : undefined
            }
            spDownload={
              spCsv ? (
                <DownloadCsvButton
                  csv={spCsv}
                  filename={`${exportSlug}-sp.csv`}
                  label="SCARICA REPORT SP"
                />
              ) : undefined
            }
          />
          <ConceptQuadrant
            concept={conceptView}
            notes={privateQuadrantNotes}
            alwaysVisible
            matrixDownload={
              matriceCsv ? (
                <DownloadCsvButton
                  csv={matriceCsv}
                  filename={`${exportSlug}-matrice.csv`}
                  label="SCARICA REPORT MATRICE"
                />
              ) : undefined
            }
          />
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-[1440px] flex-col items-center px-[var(--spacing-gutter)]">
          <div className="flex w-[1160px] flex-col">
            <ReadingGuideBar />
            {aiHandoffPrompt ? <AiHandoffBar prompt={aiHandoffPrompt} /> : null}
          </div>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-[var(--container-page)] flex-col items-center px-[var(--spacing-gutter)]">
          <div
            className="flex flex-col"
            style={{ width: CONCEPT_CARD_GRID_W }}
          >
            <div className="flex w-full flex-col">
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-sans text-display-caps uppercase text-fg-primary">
                    Azioni
                  </h2>
                  <div className="-mt-[7px] border-t border-dashed border-fg-primary" />
                </div>

                <div className="flex w-full flex-col border border-fg-primary bg-bg-elevated">
                  <div className={actionRowClassName}>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-sans text-body font-medium uppercase leading-normal text-fg-primary">
                        Diagnosi CFML
                      </h3>
                      <span className="font-sans text-body leading-normal text-fg-primary opacity-70">
                        {cfmlCompleted
                          ? `${formatCfmlLevel(conceptView.cfmlLevelsPassed)} - ${formatScore(conceptView.cfml)}/100`
                          : "Non ancora compilata"}
                      </span>
                    </div>
                    <Link
                      href={`/concept/${conceptView.id}/cfml`}
                      className={secondaryActionButtonClassName}
                    >
                      {cfmlCompleted ? "Modifica diagnosi" : "Compila diagnosi"}
                    </Link>
                  </div>

                  <div className={`${actionRowClassName} border-t border-fg-primary`}>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-sans text-body font-medium uppercase leading-normal text-fg-primary">
                        Survey SP
                      </h3>
                      <span className="font-sans text-body leading-normal text-fg-primary opacity-70">
                        {latestSurvey
                          ? `${formatSurveyDateItalian(latestSurvey.created_at)} - ${latestSurvey.responsesCount} ${
                              latestSurvey.responsesCount === 1
                                ? "risposta raccolta"
                                : "risposte raccolte"
                            }`
                          : "Nessuna survey creata"}
                      </span>
                    </div>
                    {latestSurvey ? (
                      <CopySurveyLinkButton
                        publicToken={latestSurvey.public_token}
                      />
                    ) : (
                      <span className="inline-block w-[200px]" aria-hidden />
                    )}
                  </div>

                  <div className={`${actionRowClassName} border-t border-fg-primary`}>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-sans text-body font-medium uppercase leading-normal text-fg-primary">
                        Nuova survey
                      </h3>
                      <span className="font-sans text-body leading-normal text-fg-primary opacity-70">
                        Il pack è congelato nella survey attiva. Per
                        modificarlo serve una nuova survey.
                      </span>
                    </div>
                    <Link
                      href={`/concept/${conceptView.id}/sp`}
                      className={secondaryActionButtonClassName}
                    >
                      Crea survey
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                {latestSurvey ? (
                  <DeleteSurveyButton
                    surveyId={latestSurvey.id}
                    responsesCount={latestSurvey.responsesCount}
                  />
                ) : null}
                <DeleteConceptButton
                  conceptId={conceptView.id}
                  conceptTitle={conceptView.title}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
