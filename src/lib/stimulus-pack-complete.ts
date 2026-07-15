export const MIN_STIMULUS_PACK_IMAGES = 3;

export type StimulusPackCompleteInput = {
  sector?: string | null;
  description?: string | null;
  context_scenario?: string | null;
  target_user?: string | null;
  images?: string[] | null;
};

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

function countImages(images: string[] | null | undefined): number {
  return (images ?? []).filter(Boolean).length;
}

export function getStimulusPackCompletionSegments(
  input: StimulusPackCompleteInput
): [boolean, boolean, boolean, boolean] {
  const hasSector = hasText(input.sector);
  const hasDescription = hasText(input.description);
  const hasContextAndTarget =
    hasText(input.context_scenario) && hasText(input.target_user);
  const hasImages = countImages(input.images) >= MIN_STIMULUS_PACK_IMAGES;

  return [hasSector, hasDescription, hasContextAndTarget, hasImages];
}

export function isStimulusPackComplete(
  input: StimulusPackCompleteInput
): { complete: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!hasText(input.sector)) {
    missing.push("settore");
  }
  if (!hasText(input.description)) {
    missing.push("descrizione");
  }
  if (!hasText(input.context_scenario)) {
    missing.push("contesto/scenario");
  }
  if (!hasText(input.target_user)) {
    missing.push("utente target");
  }
  if (countImages(input.images) < MIN_STIMULUS_PACK_IMAGES) {
    missing.push("almeno 3 immagini");
  }

  return {
    complete: missing.length === 0,
    missing,
  };
}
