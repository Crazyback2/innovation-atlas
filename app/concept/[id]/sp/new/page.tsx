import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import StimulusPackView from "@/app/components/sp/StimulusPackView";
import { createClient } from "@/src/lib/supabase/server";
import { isStimulusPackComplete } from "@/src/lib/stimulus-pack-complete";
import CreateSPSurveyConfirm from "./CreateSPSurveyConfirm";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ConceptRow = {
  id: string;
  title: string;
  description: string | null;
  sector: string;
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
    title: `Crea survey SP — ${concept.title} — Innovation Atlas`,
  };
}

export default async function NewSPSurveyPage({ params }: PageProps) {
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
      "id, title, description, sector, context_scenario, target_user, images, image_captions, video_url, owner_id"
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    notFound();
  }

  const typedConcept = concept as ConceptRow;

  const pack = {
    title: typedConcept.title,
    description: typedConcept.description,
    sector: typedConcept.sector,
    context_scenario: typedConcept.context_scenario,
    target_user: typedConcept.target_user,
    images: typedConcept.images ?? [],
    image_captions: typedConcept.image_captions ?? {},
    video_url: typedConcept.video_url,
  };

  const packCompleteness = isStimulusPackComplete({
    sector: typedConcept.sector,
    description: typedConcept.description,
    context_scenario: typedConcept.context_scenario,
    target_user: typedConcept.target_user,
    images: typedConcept.images,
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <div className="mx-auto box-content w-full max-w-[1160px] px-6 md:px-8">
          <Link
            href={`/concept/${typedConcept.id}`}
            className="font-sans text-body leading-normal text-fg-primary underline opacity-70 transition-opacity duration-150 ease-out hover:opacity-100"
          >
            ← Torna al concept
          </Link>

          <header className="mt-6">
            <h1 className="font-heading text-display font-bold leading-normal text-fg-primary">
              Crea nuova survey SP
            </h1>
            <p className="mt-4 font-sans text-body leading-relaxed text-fg-primary opacity-70">
              Stai per congelare lo stimulus pack qui sotto in una nuova survey.
              Una volta creata, non potrai più modificare il pack del concept
              finché questa survey non viene cancellata. Puoi avere più survey
              attive contemporaneamente.
            </p>
          </header>

          <StimulusPackView pack={pack} variant="preview" />

          <CreateSPSurveyConfirm
            conceptId={typedConcept.id}
            packComplete={packCompleteness.complete}
            missingFields={packCompleteness.missing}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
