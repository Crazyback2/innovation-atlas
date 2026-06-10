"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import {
  calculateCFML,
  type CFMLAnswers,
  type CFMLLevelKey,
} from "@/src/lib/scoring";

const CFML_VERSION = "v1_2026-06";

export async function submitCFML({
  conceptId,
  answers,
}: {
  conceptId: string;
  answers: CFMLAnswers;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: concept } = await supabase
    .from("concepts")
    .select("id")
    .eq("id", conceptId)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    throw new Error("Concept non trovato o non autorizzato");
  }

  const result = calculateCFML(answers);

  const cfmlLevelsPassed = ([1, 2, 3, 4, 5, 6] as const)
    .filter((level) => result.levelConsolidation[`L${level}` as CFMLLevelKey])
    .map((level) => level);

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("concepts")
    .update({
      cfml_answers: answers,
      cfml_score: result.score,
      cfml_level: result.level,
      cfml_levels_passed: cfmlLevelsPassed,
      cfml_completed_at: now,
      cfml_version: CFML_VERSION,
      updated_at: now,
    })
    .eq("id", conceptId)
    .eq("owner_id", user.id);

  if (error) {
    throw new Error("Impossibile salvare i risultati CFML. Riprova più tardi.");
  }

  revalidatePath(`/concept/${conceptId}`);
  revalidatePath(`/concept/${conceptId}/cfml/results`);

  redirect(`/concept/${conceptId}/cfml/results`);
}
