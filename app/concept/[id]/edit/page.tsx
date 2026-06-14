import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/src/lib/supabase/server";
import EditConceptForm from "./EditConceptForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ConceptRow = {
  id: string;
  title: string;
  sector: string;
  description: string | null;
  context_scenario: string | null;
  target_user: string | null;
  images: string[] | null;
  image_captions: Record<string, string> | null;
  video_url: string | null;
  owner_id: string;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: concept } = await supabase
    .from("concepts")
    .select("title")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    return { title: "Concept non trovato — Innovation Atlas" };
  }

  return {
    title: `Modifica — ${concept.title} — Innovation Atlas`,
  };
}

export default async function EditConceptPage({ params }: PageProps) {
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
      "id, title, sector, description, context_scenario, target_user, images, image_captions, video_url, owner_id"
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    notFound();
  }

  const typedConcept = concept as ConceptRow;

  const { count: surveyCount } = await supabase
    .from("sp_surveys")
    .select("*", { count: "exact", head: true })
    .eq("concept_id", id);

  const packLocked = (surveyCount ?? 0) > 0;

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <div className="mx-auto w-full max-w-2xl px-[var(--spacing-gutter)]">
          <h1 className="font-sans text-display font-medium leading-normal text-fg-primary">
            Modifica concept
          </h1>
          <p className="mt-2 font-heading text-body leading-normal text-fg-primary opacity-70">
            Aggiorna i dati del concept e lo stimulus pack. Solo titolo e settore
            sono obbligatori.
          </p>

          <div className="mt-10">
            <EditConceptForm
              conceptId={typedConcept.id}
              packLocked={packLocked}
              initialTitle={typedConcept.title}
              initialSector={typedConcept.sector}
              initialDescription={typedConcept.description ?? ""}
              initialContextScenario={typedConcept.context_scenario ?? ""}
              initialTargetUser={typedConcept.target_user ?? ""}
              initialImages={typedConcept.images ?? []}
              initialCaptions={typedConcept.image_captions ?? {}}
              initialVideoUrl={typedConcept.video_url ?? ""}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
