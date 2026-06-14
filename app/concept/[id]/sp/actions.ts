"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { generateSPToken } from "@/src/lib/sp-token";
import SP_CONFIG_V1 from "@/src/data/sp-config/v1_2026-06";

const MAX_TOKEN_COLLISION_RETRIES = 5;

function isUniqueViolation(error: { code?: string }): boolean {
  return error.code === "23505";
}

/**
 * Crea una nuova SP survey per un concept.
 * - Verifica che l'utente sia autenticato e proprietario del concept.
 * - Snapshotta l'intera SP_CONFIG_V1 corrente nel campo config_snapshot.
 * - Genera un public_token unico. Riprova fino a 5 volte in caso di collisione (estremamente improbabile).
 * - INSERT su sp_surveys.
 * - Ritorna l'oggetto { id, publicToken } della survey creata.
 *
 * NOTA: questa action permette di creare PIU survey per lo stesso concept
 * (l'autore può rilanciare una raccolta in futuro). Non c'è check di unicità per concept_id.
 */
export async function createSPSurvey({
  conceptId,
}: {
  conceptId: string;
}): Promise<{ id: string; publicToken: string }> {
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
      "id, title, description, sector, context_scenario, target_user, images, image_captions, video_url"
    )
    .eq("id", conceptId)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    throw new Error("Concept non trovato o non autorizzato");
  }

  const pack_snapshot = {
    title: concept.title,
    description: concept.description,
    sector: concept.sector,
    context_scenario: concept.context_scenario,
    target_user: concept.target_user,
    images: concept.images ?? [],
    image_captions: concept.image_captions ?? {},
    video_url: concept.video_url,
  };

  for (let attempt = 0; attempt < MAX_TOKEN_COLLISION_RETRIES; attempt++) {
    const publicToken = generateSPToken();

    const { data: insertedRow, error } = await supabase
      .from("sp_surveys")
      .insert({
        concept_id: conceptId,
        public_token: publicToken,
        sp_version: SP_CONFIG_V1.version,
        config_snapshot: SP_CONFIG_V1,
        pack_snapshot,
        min_responses: SP_CONFIG_V1.minResponses,
      })
      .select("id, public_token")
      .single();

    if (!error && insertedRow) {
      revalidatePath(`/concept/${conceptId}`);

      return {
        id: insertedRow.id,
        publicToken: insertedRow.public_token,
      };
    }

    if (error && isUniqueViolation(error)) {
      continue;
    }

    throw new Error(
      error?.message ?? "Impossibile creare la SP survey. Riprova più tardi."
    );
  }

  throw new Error(
    "Impossibile generare un token univoco per la SP survey. Riprova più tardi."
  );
}

export async function deleteSurvey(surveyId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: survey } = await supabase
    .from("sp_surveys")
    .select("id, concept_id")
    .eq("id", surveyId)
    .limit(1)
    .maybeSingle();

  if (!survey) {
    throw new Error("Survey non trovata");
  }

  const { data: concept } = await supabase
    .from("concepts")
    .select("id")
    .eq("id", survey.concept_id)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    throw new Error("Survey non trovata o non autorizzata");
  }

  const { error } = await supabase
    .from("sp_surveys")
    .delete()
    .eq("id", surveyId);

  if (error) {
    throw new Error(
      error.message ?? "Impossibile cancellare la survey. Riprova più tardi."
    );
  }

  revalidatePath(`/concept/${survey.concept_id}`);
}
