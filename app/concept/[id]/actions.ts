"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

const BUCKET = "concept-images";

function extractStoragePath(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) {
    return null;
  }
  return publicUrl.slice(idx + marker.length);
}

/**
 * Elimina un concept e i dati collegati (survey, risposte, immagini storage).
 * Ordine esplicito: responses → surveys → storage → concept, così funziona
 * sia con ON DELETE CASCADE sia con RESTRICT sulle FK.
 */
export async function deleteConcept(conceptId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: concept } = await supabase
    .from("concepts")
    .select("id, images")
    .eq("id", conceptId)
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!concept) {
    throw new Error("Concept non trovato o non autorizzato");
  }

  const { data: surveys } = await supabase
    .from("sp_surveys")
    .select("id")
    .eq("concept_id", conceptId);

  const surveyIds = (surveys ?? []).map((survey) => survey.id as string);

  if (surveyIds.length > 0) {
    const { error: responsesError } = await supabase
      .from("sp_responses")
      .delete()
      .in("survey_id", surveyIds);

    if (responsesError) {
      throw new Error(
        responsesError.message ??
          "Impossibile eliminare le risposte SP. Riprova più tardi."
      );
    }

    const { error: surveysError } = await supabase
      .from("sp_surveys")
      .delete()
      .eq("concept_id", conceptId);

    if (surveysError) {
      throw new Error(
        surveysError.message ??
          "Impossibile eliminare le survey SP. Riprova più tardi."
      );
    }
  }

  const images = Array.isArray(concept.images)
    ? (concept.images as string[])
    : [];
  const storagePaths = images
    .map(extractStoragePath)
    .filter((path): path is string => path != null);

  if (storagePaths.length > 0) {
    await supabase.storage.from(BUCKET).remove(storagePaths);
  }

  const { error: conceptError } = await supabase
    .from("concepts")
    .delete()
    .eq("id", conceptId)
    .eq("owner_id", user.id);

  if (conceptError) {
    throw new Error(
      conceptError.message ??
        "Impossibile eliminare il concept. Riprova più tardi."
    );
  }

  revalidatePath("/concept");
}
