"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { generateSPToken } from "@/src/lib/sp-token";
import SP_CONFIG_V1 from "@/src/data/sp-config/v1_2026-06";
import { VALID_SECTORS } from "@/app/concept/new/data";

const MAX_TOKEN_COLLISION_RETRIES = 5;
const MAX_IMAGES = 5;

type ValidSector = (typeof VALID_SECTORS)[number];

export type SaveStimulusPackInput = {
  descrizione: string;
  contesto_scenario: string;
  target_user: string;
  images: string[];
  video_url: string;
  sector: string;
};

function validateImages(images: unknown): string[] | null {
  if (!Array.isArray(images) || !images.every((item) => typeof item === "string")) {
    return null;
  }

  if (images.length > MAX_IMAGES) {
    return null;
  }

  return images;
}

export async function saveStimulusPack({
  conceptId,
  pack,
}: {
  conceptId: string;
  pack: SaveStimulusPackInput;
}): Promise<{ error: string } | void> {
  const sector = pack.sector.trim();

  if (!sector || !VALID_SECTORS.includes(sector as ValidSector)) {
    return { error: "Seleziona un settore valido." };
  }

  const images = validateImages(pack.images);
  if (images === null) {
    return { error: "Formato immagini non valido." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Devi essere autenticato per salvare lo stimulus pack." };
  }

  const { data: concept } = await supabase
    .from("concepts")
    .select("id")
    .eq("id", conceptId)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    return { error: "Concept non trovato o non autorizzato." };
  }

  const description = pack.descrizione.trim();
  const contextScenario = pack.contesto_scenario.trim();
  const targetUser = pack.target_user.trim();
  const videoUrl = pack.video_url.trim();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("concepts")
    .update({
      description: description || null,
      context_scenario: contextScenario || null,
      target_user: targetUser || null,
      video_url: videoUrl || null,
      sector,
      images,
      updated_at: now,
    })
    .eq("id", conceptId)
    .eq("owner_id", user.id);

  if (error) {
    return { error: "Impossibile salvare lo stimulus pack. Riprova più tardi." };
  }

  revalidatePath(`/concept/${conceptId}`);
  revalidatePath(`/concept/${conceptId}/sp`);
  revalidatePath(`/concept/${conceptId}/sp/new`);
  revalidatePath(`/concept/${conceptId}/edit`);
  revalidatePath("/concept");
}

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
