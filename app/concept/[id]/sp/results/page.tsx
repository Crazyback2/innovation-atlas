import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/src/lib/supabase/server";
import { calculateSP, aggregateSP } from "@/src/lib/sp-scoring";
import type { SPConfig, SPAnswers, SPResult } from "@/src/data/sp-config/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ConceptRow = {
  id: string;
  title: string;
};

type SurveyRow = {
  id: string;
  public_token: string;
  sp_version: string;
  config_snapshot: SPConfig;
  min_responses: number;
  created_at: string;
};

type ResponseRow = {
  id: string;
  answers: SPAnswers;
};

function formatScore(value: number): string {
  return value.toFixed(1);
}

function formatDateItalian(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
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
      ? `Risultati SP — ${concept.title} — Innovation Atlas`
      : "Risultati SP — Innovation Atlas",
  };
}

function SPResultsContent({
  aggregatedResult,
  responseCount,
  minResponses,
}: {
  aggregatedResult: SPResult;
  responseCount: number;
  minResponses: number;
}) {
  const belowThreshold =
    responseCount > 0 && responseCount < minResponses;

  return (
    <>
      {belowThreshold && (
        <p className="mt-10 max-w-[640px] font-sans text-body leading-relaxed text-fg-primary opacity-75">
          Soglia minima non raggiunta: {responseCount} su {minResponses}{" "}
          risposte. I risultati sotto sono indicativi.
        </p>
      )}

      <section
        className={`flex flex-col gap-2 ${belowThreshold ? "mt-6" : "mt-10"}`}
      >
        <h2 className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
          Punteggio totale
        </h2>
        <p className="font-heading text-display font-bold leading-normal text-fg-primary">
          {formatScore(aggregatedResult.total)} / 100
        </p>
      </section>

      <section className="mt-10 flex flex-col gap-4">
        <h2 className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
          Profilo per dimensione
        </h2>
        <ul className="flex flex-col gap-3">
          {aggregatedResult.perDimension.map((dimension) => (
            <li
              key={dimension.dimensionId}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-accent-tertiary py-3"
            >
              <span className="font-heading text-body leading-relaxed text-fg-primary">
                {dimension.title}
              </span>
              <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
                {formatScore(dimension.score)} / 100
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default async function SPResultsPage({ params }: PageProps) {
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
    .select("id, title")
    .eq("id", id)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    throw new Error("Concept non trovato o non autorizzato");
  }

  const typedConcept = concept as ConceptRow;

  const { data: survey } = await supabase
    .from("sp_surveys")
    .select(
      "id, public_token, sp_version, config_snapshot, min_responses, created_at"
    )
    .eq("concept_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!survey) {
    return (
      <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
        <Header />

        <main className="flex-1 py-[var(--spacing-section)]">
          <div className="mx-auto w-full max-w-[720px] px-[var(--spacing-gutter)]">
            <h1 className="font-heading text-display font-bold leading-normal text-fg-primary">
              {typedConcept.title}
            </h1>

            <p className="mt-10 font-sans text-body leading-relaxed text-fg-primary opacity-75">
              Nessuna SP survey creata per questo concept.
            </p>

            <div className="mt-10">
              <Link
                href={`/concept/${typedConcept.id}`}
                className="bg-fg-primary px-6 py-[14px] font-sans text-body font-medium leading-normal text-bg-primary transition-opacity duration-150 ease-out hover:opacity-90"
              >
                Torna al concept
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const typedSurvey = survey as SurveyRow;
  const config = typedSurvey.config_snapshot as SPConfig;
  const publicPath = `/sp/${typedSurvey.public_token}`;

  const { data: responses } = await supabase
    .from("sp_responses")
    .select("id, answers")
    .eq("survey_id", typedSurvey.id);

  const typedResponses = (responses ?? []) as ResponseRow[];
  const responseCount = typedResponses.length;

  let aggregatedResult: SPResult | null = null;

  if (responseCount > 0) {
    const individualResults = typedResponses.map((response) =>
      calculateSP(response.answers, config)
    );
    aggregatedResult = aggregateSP(individualResults, config);
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <div className="mx-auto w-full max-w-[720px] px-[var(--spacing-gutter)]">
          <h1 className="font-heading text-display font-bold leading-normal text-fg-primary">
            {typedConcept.title}
          </h1>

          <section className="mt-10 flex flex-col gap-1">
            <p className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              SP version: {typedSurvey.sp_version}
            </p>
            <p className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              Created at: {formatDateItalian(typedSurvey.created_at)}
            </p>
            <p className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              Responses: {responseCount}
            </p>
            <p className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              Public token: {typedSurvey.public_token}
            </p>
          </section>

          {responseCount === 0 ? (
            <div className="mt-10 flex flex-col gap-4">
              <p className="font-sans text-body leading-relaxed text-fg-primary opacity-75">
                Nessuna risposta raccolta finora.
              </p>
              <p className="font-sans text-body leading-relaxed text-fg-primary">
                Link pubblico:{" "}
                <Link
                  href={publicPath}
                  className="font-mono text-metadata text-accent-primary underline underline-offset-2"
                >
                  {publicPath}
                </Link>
              </p>
            </div>
          ) : (
            aggregatedResult && (
              <SPResultsContent
                aggregatedResult={aggregatedResult}
                responseCount={responseCount}
                minResponses={typedSurvey.min_responses}
              />
            )
          )}

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={`/concept/${typedConcept.id}`}
              className="bg-fg-primary px-6 py-[14px] font-sans text-body font-medium leading-normal text-bg-primary transition-opacity duration-150 ease-out hover:opacity-90"
            >
              Torna al concept
            </Link>
            <div className="border border-accent-tertiary bg-transparent px-6 py-[14px] font-sans text-body font-medium leading-normal text-fg-primary">
              Vedi il link pubblico:{" "}
              <span className="font-mono text-metadata">{publicPath}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
