"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import type { SPAnswers } from "@/src/data/sp-config/types";

export async function submitSPResponse(formData: FormData): Promise<void> {
  const surveyId = formData.get("surveyId");
  const token = formData.get("token");

  if (typeof surveyId !== "string" || !surveyId) {
    throw new Error("Survey ID mancante");
  }

  if (typeof token !== "string" || !token) {
    throw new Error("Token mancante");
  }

  const answers: SPAnswers = {};

  for (const [key, value] of formData.entries()) {
    if (key === "surveyId" || key === "token") {
      continue;
    }

    if (typeof value !== "string" || !value) {
      continue;
    }

    if (key === "R5_open") {
      answers[key] = value;
      continue;
    }

    const numericValue = parseInt(value, 10);
    if (!Number.isNaN(numericValue)) {
      answers[key] = numericValue;
    }
  }

  const supabase = await createClient();

  const { data: survey } = await supabase
    .from("sp_surveys")
    .select("id")
    .eq("id", surveyId)
    .maybeSingle();

  if (!survey) {
    throw new Error("Survey non trovata");
  }

  const { error } = await supabase.from("sp_responses").insert({
    survey_id: surveyId,
    answers,
    respondent_fingerprint: null,
  });

  if (error) {
    throw new Error(
      error.message ?? "Impossibile salvare la risposta. Riprova più tardi."
    );
  }

  redirect(`/sp/${token}/grazie`);
}
