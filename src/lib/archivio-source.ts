import type { Concept } from "@/src/data/concepts";
import { REAL_CONCEPT_SLUG_TO_UUID } from "@/src/data/concepts";
import type { SPConfig, SPAnswers, SPResult } from "@/src/data/sp-config/types";
import type { CFMLAnswers } from "@/src/lib/scoring";
import { createClient } from "@/src/lib/supabase/server";
import { calculateSP, aggregateSP } from "@/src/lib/sp-scoring";
import { calculateCFML } from "@/src/lib/scoring";
import { toConceptView, type ConceptDbRow } from "@/src/lib/concept-adapter";
import { CONCEPT_EDITORIAL } from "@/src/lib/concept-editorial";

// Mappa slug pubblico -> UUID reale in DB (concepts.is_public = true).
// Fonte di verità unica in src/data/concepts.ts (REAL_CONCEPT_SLUG_TO_UUID),
// riusata qui per non duplicare gli identificativi dei concept reali.
export const REAL_CONCEPT_IDS: Record<string, string> = REAL_CONCEPT_SLUG_TO_UUID;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Carica SOLO le immagini reali (colonna images) dei 3 concept pubblici dal DB,
// mappate sullo slug pubblico (shu/cubit/hapto). Query leggera: niente aggregati
// SP/CFML. Serve a mostrare la hero image reale nelle card dell'archivio senza
// modificare src/data/concepts.ts.
export async function loadRealConceptImages(): Promise<Record<string, string[]>> {
  const supabase = await createClient();

  const uuidToSlug = Object.fromEntries(
    Object.entries(REAL_CONCEPT_IDS).map(([slug, uuid]) => [uuid, slug])
  );

  const { data, error } = await supabase
    .from("concepts")
    .select("id, images")
    .in("id", Object.values(REAL_CONCEPT_IDS))
    .eq("is_public", true);

  if (error || !data) {
    return {};
  }

  const result: Record<string, string[]> = {};
  for (const row of data as { id: string; images: string[] | null }[]) {
    const slug = uuidToSlug[row.id];
    if (slug && row.images && row.images.length > 0) {
      result[slug] = row.images;
    }
  }
  return result;
}

export function resolveConceptId(param: string): string | null {
  const mapped = REAL_CONCEPT_IDS[param.toLowerCase()];
  if (mapped) {
    return mapped;
  }
  if (UUID_RE.test(param)) {
    return param;
  }
  return null;
}

type RealConceptRow = ConceptDbRow & {
  cfml_answers: CFMLAnswers | null;
};

type SurveyRow = {
  id: string;
  public_token: string;
  sp_version: string;
  config_snapshot: SPConfig;
  min_responses: number;
  created_at: string;
};

type ResponseRow = {
  id: string;
  answers: SPAnswers;
};

export async function loadRealConcept(uuid: string): Promise<Concept | null> {
  const supabase = await createClient();

  const { data: concept, error } = await supabase
    .from("concepts")
    .select(
      "id, title, description, images, sector, cfml_score, cfml_levels_passed, cfml_completed_at, cfml_answers, created_at"
    )
    .eq("id", uuid)
    .eq("is_public", true)
    .maybeSingle();

  if (error || !concept) {
    return null;
  }

  const row = concept as RealConceptRow;

  // SP: replica ESATTA del pattern in app/concept/[id]/sp/results/page.tsx
  const { data: survey } = await supabase
    .from("sp_surveys")
    .select(
      "id, public_token, sp_version, config_snapshot, min_responses, created_at"
    )
    .eq("concept_id", uuid)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let spAggregate: SPResult | null = null;
  let spResponseCount = 0;

  if (survey) {
    const typedSurvey = survey as SurveyRow;
    const config = typedSurvey.config_snapshot as SPConfig;

    const { data: responses } = await supabase
      .from("sp_responses")
      .select("id, answers")
      .eq("survey_id", typedSurvey.id);

    const typedResponses = (responses ?? []) as ResponseRow[];
    spResponseCount = typedResponses.length;

    if (spResponseCount > 0) {
      const individualResults = typedResponses.map((response) =>
        calculateSP(response.answers, config)
      );
      spAggregate = aggregateSP(individualResults, config);
    }
  }

  // CFML: breakdown ricalcolato come in app/concept/[id]/cfml/results/page.tsx.
  // Come lì (cfml_score ?? result.score), il ricalcolo funge da fallback.
  const cfmlResult = row.cfml_answers ? calculateCFML(row.cfml_answers) : null;

  return toConceptView(
    {
      row,
      spAggregate,
      spResponseCount,
      cfmlResult,
      cfmlAnswers: row.cfml_answers,
    },
    {
      ...CONCEPT_EDITORIAL[uuid],
      ...(cfmlResult
        ? {
            cfml: row.cfml_score ?? cfmlResult.score,
            cfmlLevelsPassed: row.cfml_levels_passed?.length ?? cfmlResult.level,
          }
        : {}),
    }
  );
}
