import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/src/lib/supabase/server";
import type { CFMLAnswers } from "@/src/lib/scoring";
import CFMLWizard from "./CFMLWizard";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ConceptRow = {
  id: string;
  title: string;
  owner_id: string;
  cfml_answers: Partial<CFMLAnswers> | null;
};

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
      ? `CFML — ${concept.title} — Innovation Atlas`
      : "CFML — Innovation Atlas",
  };
}

export default async function CFMLPage({ params }: PageProps) {
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
    .select("id, title, owner_id, cfml_answers")
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

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <div className="mx-auto w-full max-w-[var(--container-wizard)] px-[var(--spacing-gutter)]">
          <h1 className="font-heading text-display font-bold leading-normal text-fg-primary">
            CFML — {typedConcept.title}
          </h1>
          <p className="mt-2 font-heading text-body leading-relaxed text-fg-primary opacity-70">
            Compila le 16 domande per valutare la maturità funzionale del tuo
            concept.
          </p>

          <div className="mt-10">
            <CFMLWizard
              conceptId={typedConcept.id}
              initialAnswers={typedConcept.cfml_answers ?? {}}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
