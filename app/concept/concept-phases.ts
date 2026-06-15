import type { ArchiveConceptCardData } from "@/app/components/CardGrid";
import { calculateSP, aggregateSP } from "@/src/lib/sp-scoring";
import type { SPConfig, SPAnswers } from "@/src/data/sp-config/types";

export type ConceptPhase = "drafts" | "ready" | "validating" | "mapped";

export type ConceptPhaseCounts = Record<ConceptPhase, number>;

export type ConceptsByPhase = Record<ConceptPhase, ArchiveConceptCardData[]>;

type ConceptRow = {
  id: string;
  title: string;
  images: string[] | null;
  cfml_score: number | null;
  cfml_completed_at: string | null;
  created_at: string;
};

type SurveyRow = {
  id: string;
  concept_id: string;
  config_snapshot: SPConfig;
  created_at: string;
};

type ResponseRow = {
  survey_id: string;
  answers: SPAnswers;
};

export function createEmptyPhaseCounts(): ConceptPhaseCounts {
  return {
    drafts: 0,
    ready: 0,
    validating: 0,
    mapped: 0,
  };
}

export function createEmptyConceptsByPhase(): ConceptsByPhase {
  return {
    drafts: [],
    ready: [],
    validating: [],
    mapped: [],
  };
}

function getConceptPhase(
  concept: Pick<ConceptRow, "id" | "cfml_completed_at">,
  surveysByConceptId: Map<string, string[]>,
  responsesBySurveyId: Map<string, number>
): ConceptPhase {
  if (!concept.cfml_completed_at) {
    return "drafts";
  }

  const surveyIds = surveysByConceptId.get(concept.id) ?? [];
  if (surveyIds.length === 0) {
    return "ready";
  }

  const totalResponses = surveyIds.reduce(
    (sum, surveyId) => sum + (responsesBySurveyId.get(surveyId) ?? 0),
    0
  );

  if (totalResponses >= 10) {
    return "mapped";
  }

  return "validating";
}

function roundCfmlScore(score: number | null): number | null {
  return score == null ? null : Math.round(score);
}

function computeSpScore(
  surveys: SurveyRow[],
  responsesBySurveyId: Map<string, ResponseRow[]>
): number | null {
  if (surveys.length === 0) {
    return null;
  }

  const sortedSurveys = [...surveys].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  for (const survey of sortedSurveys) {
    const responses = responsesBySurveyId.get(survey.id) ?? [];
    if (responses.length === 0) {
      continue;
    }

    const config = survey.config_snapshot;
    const individualResults = responses.map((response) =>
      calculateSP(response.answers, config)
    );
    const aggregated = aggregateSP(individualResults, config);
    return Math.round(aggregated.total);
  }

  return null;
}

function getDisplayScores(
  phase: ConceptPhase,
  cfmlScore: number | null,
  spScore: number | null
): Pick<ArchiveConceptCardData, "sp" | "cfml"> {
  switch (phase) {
    case "drafts":
      return { sp: null, cfml: null };
    case "ready":
      return { sp: null, cfml: cfmlScore };
    case "validating":
    case "mapped":
      return { sp: spScore, cfml: cfmlScore };
  }
}

export function countConceptsByPhase(
  concepts: Pick<ConceptRow, "id" | "cfml_completed_at">[],
  surveys: Pick<SurveyRow, "id" | "concept_id">[],
  responses: Pick<ResponseRow, "survey_id">[]
): ConceptPhaseCounts {
  const counts = createEmptyPhaseCounts();

  const surveysByConceptId = new Map<string, string[]>();
  for (const survey of surveys) {
    const existing = surveysByConceptId.get(survey.concept_id) ?? [];
    existing.push(survey.id);
    surveysByConceptId.set(survey.concept_id, existing);
  }

  const responsesBySurveyId = new Map<string, number>();
  for (const survey of surveys) {
    responsesBySurveyId.set(survey.id, 0);
  }
  for (const response of responses) {
    const surveyId = response.survey_id;
    responsesBySurveyId.set(
      surveyId,
      (responsesBySurveyId.get(surveyId) ?? 0) + 1
    );
  }

  for (const concept of concepts) {
    const phase = getConceptPhase(
      concept,
      surveysByConceptId,
      responsesBySurveyId
    );
    counts[phase] += 1;
  }

  return counts;
}

export function buildConceptsByPhase(
  concepts: ConceptRow[],
  surveys: SurveyRow[],
  responses: ResponseRow[],
  authorName: string
): ConceptsByPhase {
  const grouped = createEmptyConceptsByPhase();

  const surveysByConceptId = new Map<string, SurveyRow[]>();
  for (const survey of surveys) {
    const existing = surveysByConceptId.get(survey.concept_id) ?? [];
    existing.push(survey);
    surveysByConceptId.set(survey.concept_id, existing);
  }

  const responsesBySurveyId = new Map<string, ResponseRow[]>();
  for (const response of responses) {
    const existing = responsesBySurveyId.get(response.survey_id) ?? [];
    existing.push(response);
    responsesBySurveyId.set(response.survey_id, existing);
  }

  const responseCountsBySurveyId = new Map<string, number>();
  for (const survey of surveys) {
    responseCountsBySurveyId.set(
      survey.id,
      responsesBySurveyId.get(survey.id)?.length ?? 0
    );
  }

  const surveyIdsByConceptId = new Map<string, string[]>();
  for (const survey of surveys) {
    const existing = surveyIdsByConceptId.get(survey.concept_id) ?? [];
    existing.push(survey.id);
    surveyIdsByConceptId.set(survey.concept_id, existing);
  }

  for (const concept of concepts) {
    const conceptSurveys = surveysByConceptId.get(concept.id) ?? [];
    const phase = getConceptPhase(
      concept,
      surveyIdsByConceptId,
      responseCountsBySurveyId
    );

    const cfmlScore = roundCfmlScore(concept.cfml_score);
    const spScore = computeSpScore(conceptSurveys, responsesBySurveyId);
    const displayScores = getDisplayScores(phase, cfmlScore, spScore);

    grouped[phase].push({
      id: concept.id,
      title: concept.title,
      author: { name: authorName },
      images: concept.images ?? [],
      sp: displayScores.sp,
      cfml: displayScores.cfml,
    });
  }

  return grouped;
}
