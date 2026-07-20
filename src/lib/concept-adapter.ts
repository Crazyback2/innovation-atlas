import type { Concept } from "@/src/data/concepts";
import type { SPResult } from "@/src/data/sp-config/types";

export type ConceptDbRow = {
  id: string;
  title: string;
  description: string | null;
  images: string[] | null;
  sector: string | null;
  cfml_score: number | null;
  cfml_levels_passed: unknown[] | null;
  cfml_completed_at: string | null;
  created_at: string;
};

export type ToConceptViewInput = {
  row: ConceptDbRow;
  spAggregate: SPResult | null;
  spResponseCount: number;
};

export function toConceptView(
  input: ToConceptViewInput,
  overrides?: Partial<Concept>
): Concept {
  const { row, spAggregate, spResponseCount } = input;

  const base: Concept = {
    // Campi con fonte diretta nel DB
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    images: row.images ?? [],
    sector: row.sector ?? "",
    cfml: row.cfml_score ?? 0,
    cfmlLevelsPassed: row.cfml_levels_passed?.length ?? 0,
    cfmlCompletedAt: row.cfml_completed_at ?? undefined,
    sp: spAggregate?.total ?? 0,
    spResponses: spResponseCount,
    createdAt: row.created_at,

    // Campi senza fonte nel DB: fallback espliciti, da definire via overrides.
    number: "", // TODO editoriale
    tagline: "", // TODO editoriale
    tags: [], // TODO editoriale
    author: { name: "", handle: "" }, // TODO editoriale
    // spWindowStart: nessuna fonte DB // TODO editoriale
    // spWindowEnd: nessuna fonte DB // TODO editoriale
    // positioningNotes: nessuna fonte DB // TODO editoriale
  };

  return { ...base, ...overrides };
}
