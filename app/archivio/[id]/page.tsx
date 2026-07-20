import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ConceptHero from "@/app/components/ConceptHero";
import ConceptStats from "@/app/components/ConceptStats";
import ConceptQuadrant from "@/app/components/ConceptQuadrant";
import ConceptSurveyCTA from "@/app/components/ConceptSurveyCTA";
import ConceptComments from "@/app/components/ConceptComments";
import { concepts } from "@/src/data/concepts";
import { resolveConceptId, loadRealConcept } from "@/src/lib/archivio-source";

// I tre concept pubblici leggono dati live dal DB (concepts/sp_surveys/sp_responses):
// niente cache statica, altrimenti serviremmo aggregati SP/CFML stantii.
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const uuid = resolveConceptId(id);
  const concept =
    (uuid ? await loadRealConcept(uuid) : null) ??
    concepts.find((c) => c.id === id);

  if (!concept) {
    return { title: "Concept non trovato — Innovation Atlas" };
  }

  return {
    title: `${concept.title} — Innovation Atlas`,
    description: concept.description,
  };
}

export default async function ArchivioConceptPage({ params }: PageProps) {
  const { id } = await params;
  const uuid = resolveConceptId(id);
  const concept =
    (uuid ? await loadRealConcept(uuid) : null) ??
    concepts.find((c) => c.id === id);

  if (!concept) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1">
        <div className="mx-auto flex w-[1440px] flex-col items-center pb-[120px] pt-[64px]">
          <ConceptHero concept={concept} />
          <ConceptStats concept={concept} />
          <ConceptQuadrant concept={concept} />
          <ConceptSurveyCTA concept={concept} />
          <ConceptComments concept={concept} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
