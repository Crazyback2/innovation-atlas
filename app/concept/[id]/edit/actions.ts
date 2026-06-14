"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { VALID_SECTORS } from "@/app/concept/new/data";

type ValidSector = (typeof VALID_SECTORS)[number];

function parseImagesField(raw: string): string[] | null {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
      return null;
    }

    if (parsed.length > 5) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function parseImageCaptionsField(
  raw: string
): Record<string, string> | null | undefined {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return undefined;
    }

    const cleaned: Record<string, string> = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) {
          cleaned[key] = trimmed;
        }
      }
    }

    return Object.keys(cleaned).length > 0 ? cleaned : null;
  } catch {
    return undefined;
  }
}

export async function updateConcept(
  conceptId: string,
  formData: FormData
): Promise<{ error: string } | void> {
  const title = String(formData.get("title") ?? "").trim();
  const sector = String(formData.get("sector") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const contextScenario = String(formData.get("context_scenario") ?? "").trim();
  const targetUser = String(formData.get("target_user") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();

  if (!title) {
    return { error: "Inserisci un titolo per il concept." };
  }

  if (!sector || !VALID_SECTORS.includes(sector as ValidSector)) {
    return { error: "Seleziona un settore valido." };
  }

  const images = parseImagesField(String(formData.get("images") ?? "[]"));
  if (images === null) {
    return { error: "Formato immagini non valido." };
  }

  const imageCaptions = parseImageCaptionsField(
    String(formData.get("image_captions") ?? "{}")
  );
  if (imageCaptions === undefined) {
    return { error: "Formato didascalie non valido." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Devi essere autenticato per modificare un concept." };
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

  const { error } = await supabase
    .from("concepts")
    .update({
      title,
      sector,
      description: description || null,
      context_scenario: contextScenario || null,
      target_user: targetUser || null,
      video_url: videoUrl || null,
      images,
      image_captions: imageCaptions,
    })
    .eq("id", conceptId)
    .eq("owner_id", user.id);

  if (error) {
    return { error: "Impossibile salvare le modifiche. Riprova più tardi." };
  }

  revalidatePath(`/concept/${conceptId}`);
  revalidatePath(`/concept/${conceptId}/edit`);
  revalidatePath("/concept");

  redirect(`/concept/${conceptId}`);
}
