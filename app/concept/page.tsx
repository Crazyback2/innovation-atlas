import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/src/lib/supabase/server";
import type { SPConfig, SPAnswers } from "@/src/data/sp-config/types";
import ConceptDashboard from "./ConceptDashboard";
import {
  buildConceptsByPhase,
  createEmptyConceptsByPhase,
} from "./concept-phases";

export const metadata = {
  title: "I miei concept — Innovation Atlas",
};

export default async function MyConceptsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const authorName =
    typeof user.user_metadata?.full_name === "string" &&
    user.user_metadata.full_name.trim().length > 0
      ? user.user_metadata.full_name.trim()
      : (user.email ?? "—");

  const { data: concepts } = await supabase
    .from("concepts")
    .select(
      "id, title, images, cfml_score, cfml_completed_at, created_at"
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const typedConcepts = concepts ?? [];
  let conceptsByPhase = createEmptyConceptsByPhase();

  if (typedConcepts.length > 0) {
    const conceptIds = typedConcepts.map((concept) => concept.id);
    const { data: surveys } = await supabase
      .from("sp_surveys")
      .select("id, concept_id, config_snapshot, created_at")
      .in("concept_id", conceptIds);

    const typedSurveys = (surveys ?? []).map((survey) => ({
      id: survey.id as string,
      concept_id: survey.concept_id as string,
      config_snapshot: survey.config_snapshot as SPConfig,
      created_at: survey.created_at as string,
    }));

    const surveyIds = typedSurveys.map((survey) => survey.id);
    let typedResponses: { survey_id: string; answers: SPAnswers }[] = [];

    if (surveyIds.length > 0) {
      const { data: responses } = await supabase
        .from("sp_responses")
        .select("survey_id, answers")
        .in("survey_id", surveyIds);

      typedResponses = (responses ?? []).map((response) => ({
        survey_id: response.survey_id as string,
        answers: response.answers as SPAnswers,
      }));
    }

    conceptsByPhase = buildConceptsByPhase(
      typedConcepts,
      typedSurveys,
      typedResponses,
      authorName
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <ConceptDashboard conceptsByPhase={conceptsByPhase} />
      </main>

      <Footer />
    </div>
  );
}
