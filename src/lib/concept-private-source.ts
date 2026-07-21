import type { SPConfig, SPAnswers, SPResult } from "@/src/data/sp-config/types";
import type { CFMLAnswers } from "@/src/lib/scoring";
import { calculateCFML } from "@/src/lib/scoring";
import { calculateSP, aggregateSP } from "@/src/lib/sp-scoring";
import {
  type ConceptDbRow,
  type ToConceptViewInput,
} from "@/src/lib/concept-adapter";
import { resolveConceptId } from "@/src/lib/archivio-source";
import { createClient } from "@/src/lib/supabase/server";

type PrivateConceptRow = ConceptDbRow & {
  cfml_answers: CFMLAnswers | null;
  owner_id: string;
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

/**
 * Input per toConceptView + payload già in memoria per export CSV
 * (nessuna query extra: survey/config/risposte sono le stesse dello scoring).
 */
export type PrivateConceptData = ToConceptViewInput & {
  surveyId: string | null;
  spConfig: SPConfig | null;
  spResponseAnswers: SPAnswers[];
};

/**
 * Carica un concept privato per il data path allineato a loadRealConcept.
 * Ritorna l'input di toConceptView (senza overrides editoriali) più
 * surveyId/config/risposte grezze per l'export CSV.
 * Null se id non risolvibile, utente assente/non owner, o concept assente.
 */
export async function loadPrivateConcept(
  id: string
): Promise<PrivateConceptData | null> {
  const uuid = resolveConceptId(id);
  if (!uuid) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: concept, error } = await supabase
    .from("concepts")
    .select(
      "id, title, description, images, sector, cfml_score, cfml_levels_passed, cfml_completed_at, cfml_answers, created_at, owner_id"
    )
    .eq("id", uuid)
    .maybeSingle();

  if (error || !concept) {
    return null;
  }

  const typed = concept as PrivateConceptRow;
  if (typed.owner_id !== user.id) {
    return null;
  }

  const { owner_id: _ownerId, cfml_answers, ...dbFields } = typed;
  const row: ConceptDbRow = dbFields;

  // SP: stessa sequenza di loadRealConcept / sp/results
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
  let surveyId: string | null = null;
  let spConfig: SPConfig | null = null;
  let spResponseAnswers: SPAnswers[] = [];

  if (survey) {
    const typedSurvey = survey as SurveyRow;
    const config = typedSurvey.config_snapshot as SPConfig;
    surveyId = typedSurvey.id;
    spConfig = config;

    const { data: responses } = await supabase
      .from("sp_responses")
      .select("id, answers")
      .eq("survey_id", typedSurvey.id);

    const typedResponses = (responses ?? []) as ResponseRow[];
    spResponseCount = typedResponses.length;
    spResponseAnswers = typedResponses.map((response) => response.answers);

    if (spResponseCount > 0) {
      const individualResults = typedResponses.map((response) =>
        calculateSP(response.answers, config)
      );
      spAggregate = aggregateSP(individualResults, config);
    }
  }

  // CFML: stesso ricalcolo di loadRealConcept
  const cfmlResult = cfml_answers ? calculateCFML(cfml_answers) : null;

  return {
    row,
    spAggregate,
    spResponseCount,
    cfmlResult,
    cfmlAnswers: cfml_answers,
    surveyId,
    spConfig,
    spResponseAnswers,
  };
}
