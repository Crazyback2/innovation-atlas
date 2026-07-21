import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import type { SPConfig } from "@/src/data/sp-config/types";
import type { StimulusPackData } from "@/app/components/sp/StimulusPackView";
import SPSurveyWizard from "@/app/components/sp/SPSurveyWizard";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function SPSurveyPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: survey, error } = await supabase
    .from("sp_surveys")
    .select("*")
    .eq("public_token", token)
    .maybeSingle();

  if (error || !survey) {
    notFound();
  }

  const pack = survey.pack_snapshot as StimulusPackData | null;
  if (!pack?.title || !pack.sector) {
    notFound();
  }

  const config = survey.config_snapshot as SPConfig;

  return (
    <div className="min-h-screen bg-bg-primary py-[var(--spacing-section)] font-sans">
      <main className="w-full">
        <SPSurveyWizard
          pack={pack}
          config={config}
          surveyId={survey.id}
          token={token}
        />
      </main>
    </div>
  );
}
