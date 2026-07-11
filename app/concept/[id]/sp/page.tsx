import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/src/lib/supabase/server";
import StimulusPackWizard from "./StimulusPackWizard";
import { wizardContainerClassName } from "@/app/concept/wizard-container";

type PageProps = {
  params: Promise<{ id: string }>;
};

type ConceptRow = {
  id: string;
  title: string;
  owner_id: string;
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
      ? `Stimulus Pack — ${concept.title} — Innovation Atlas`
      : "Stimulus Pack — Innovation Atlas",
  };
}

export default async function StimulusPackPage({ params }: PageProps) {
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
    .select("id, title, owner_id")
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

      <main className="flex-1 min-w-0 overflow-x-clip py-[var(--spacing-section)]">
        <div className={wizardContainerClassName}>
          <StimulusPackWizard conceptId={typedConcept.id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
