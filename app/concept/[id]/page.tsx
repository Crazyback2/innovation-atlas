import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ConceptHero from "@/app/components/ConceptHero";
import ConceptStats from "@/app/components/ConceptStats";
import ConceptQuadrant from "@/app/components/ConceptQuadrant";
import { concepts } from "@/src/data/concepts";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return concepts.map((concept) => ({ id: concept.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const concept = concepts.find((c) => c.id === id);

  if (!concept) {
    return { title: "Concept non trovato — Innovation Atlas" };
  }

  return {
    title: `${concept.title} — Innovation Atlas`,
    description: concept.tagline,
  };
}

export default async function ConceptPage({ params }: PageProps) {
  const { id } = await params;
  const concept = concepts.find((c) => c.id === id);

  if (!concept) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1">
        <section className="relative mx-auto w-[1440px] overflow-hidden bg-bg-primary">
          <p className="absolute left-[32px] top-2 font-mono text-metadata text-fg-primary leading-normal whitespace-nowrap">
            Innovation Atlas // V.01 // 2026
          </p>
          <p className="absolute right-[32px] top-2 font-mono text-metadata text-fg-primary leading-normal text-right whitespace-nowrap">
            Research prototype // Politecnico di Milano
          </p>

          <div className="pl-[141px] pt-[64px] pb-[120px]">
            <ConceptHero concept={concept} />
            <ConceptStats concept={concept} />
            <ConceptQuadrant concept={concept} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
