import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/src/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ConceptRow = {
  id: string;
  title: string;
  description: string | null;
  sector: string;
  owner_id: string;
  cfml_score: number | null;
  cfml_level: number | null;
  cfml_completed_at: string | null;
};

type SurveyRow = {
  id: string;
  public_token: string;
};

const actionLinkClassName =
  "font-sans text-body font-medium leading-normal text-accent-primary";

function formatCfmlLevel(level: number | null): string {
  if (level == null) return "L0";
  return `L${level}`;
}

function formatScore(value: number | null): string {
  if (value == null) return "—";
  return value.toFixed(1);
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

  const { data: concept } = await supabase
    .from("concepts")
    .select(
      "id, title, description, sector, owner_id, cfml_score, cfml_level, cfml_completed_at"
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    notFound();
  }

  const typedConcept = concept as ConceptRow;
  const cfmlCompleted = typedConcept.cfml_completed_at != null;
  const statusLabel = cfmlCompleted ? "CFML COMPILATA" : "BOZZA";

  const { data: survey } = await supabase
    .from("sp_surveys")
    .select("id, public_token")
    .eq("concept_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const typedSurvey = survey as SurveyRow | null;
  let responsesCount = 0;

  if (typedSurvey) {
    const { count } = await supabase
      .from("sp_responses")
      .select("*", { count: "exact", head: true })
      .eq("survey_id", typedSurvey.id);

    responsesCount = count ?? 0;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <div className="mx-auto w-full max-w-[720px] px-[var(--spacing-gutter)]">
          <header className="flex flex-col gap-4">
            <h1 className="font-heading text-display font-bold leading-normal text-fg-primary">
              {typedConcept.title}
            </h1>

            <p className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              {typedConcept.sector} · {statusLabel}
            </p>

            {typedConcept.description ? (
              <p className="font-sans text-body leading-relaxed text-fg-primary">
                {typedConcept.description}
              </p>
            ) : null}
          </header>

          <section className="mt-12 flex flex-col gap-6">
            <h2 className="font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
              Azioni
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex items-start justify-between gap-8">
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-body font-medium leading-relaxed text-fg-primary">
                    Diagnosi CFML
                  </span>
                  {cfmlCompleted ? (
                    <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                      {formatCfmlLevel(typedConcept.cfml_level)} ·{" "}
                      {formatScore(typedConcept.cfml_score)}/100
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
                        href={`/concept/${typedConcept.id}/cfml/results`}
                        className={actionLinkClassName}
                      >
                        Vedi risultati →
                      </Link>
                      <Link
                        href={`/concept/${typedConcept.id}/cfml`}
                        className={actionLinkClassName}
                      >
                        Modifica →
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/concept/${typedConcept.id}/cfml`}
                      className={actionLinkClassName}
                    >
                      Compila →
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between gap-8">
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-body font-medium leading-relaxed text-fg-primary">
                    Symbolic Perception
                  </span>
                  {typedSurvey ? (
                    <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                      {responsesCount}{" "}
                      {responsesCount === 1
                        ? "risposta raccolta"
                        : "risposte raccolte"}
                    </span>
                  ) : (
                    <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                      Nessuna survey creata
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center justify-end gap-4">
                  {typedSurvey ? (
                    <>
                      <Link
                        href={`/concept/${typedConcept.id}/sp/results`}
                        className={actionLinkClassName}
                      >
                        Vedi risultati →
                      </Link>
                      <a
                        href={`/sp/${typedSurvey.public_token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={actionLinkClassName}
                      >
                        Link pubblico ↗
                      </a>
                    </>
                  ) : (
                    <Link
                      href={`/concept/${typedConcept.id}/cfml/results`}
                      className={actionLinkClassName}
                    >
                      Crea survey →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
