import type { Concept } from "@/src/data/concepts";
import { getQuadrant } from "@/src/data/concepts";

export type AiHandoffOptions = {
  /** Data di raccolta della survey SP usata per gli aggregati (ISO). */
  collectedAt: string;
};

const READING_RULES = [
  "Regola segnaposto 1: inquadra i due assi prima di formulare giudizi.",
  "Regola segnaposto 2: distingui evidenza numerica e interpretazione.",
  "Regola segnaposto 3: non inventare dati assenti dal prompt o dai CSV.",
  "Regola segnaposto 4: tratta il quadrante come lettura di posizione, non come verdetto.",
  "Regola segnaposto 5: considera il numero di risposte SP come limite di affidabilita.",
  "Regola segnaposto 6: separa maturita funzionale e percezione simbolica nelle raccomandazioni.",
  "Regola segnaposto 7: chiudi con domande utili a chi conosce il concept, non con un piano operativo generico.",
] as const;

function formatCollectedAt(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return date.toISOString().slice(0, 10);
}

/**
 * Prompt deterministico da copiare in un assistente esterno.
 * Nessuna chiamata di rete: solo composizione di stringa dai dati gia' noti.
 */
export function buildAiHandoffPrompt(
  concept: Concept,
  options: AiHandoffOptions
): string {
  const quadrant = getQuadrant(concept);
  const consolidationLevel = concept.cfmlLevelsPassed ?? 0;
  const dimensions = concept.spDimensions ?? [];

  const dimensionLines =
    dimensions.length > 0
      ? dimensions
          .map(
            (dimension) =>
              `- ${dimension.title}: media ${dimension.mean.toFixed(1)}`
          )
          .join("\n")
      : "- (dimensioni SP non disponibili)";

  const rules = READING_RULES.map(
    (rule, index) => `${index + 1}. ${rule}`
  ).join("\n");

  return [
    "Sei un assistente che aiuta a interpretare i risultati diagnostici di un concept di prodotto su Innovation Atlas. Restituisci una lettura chiara, rigorosa e utile a chi ha progettato il concept.",
    "",
    "## Concept",
    `Titolo: ${concept.title}`,
    `Settore: ${concept.sector}`,
    `Descrizione: ${concept.description || "(nessuna descrizione)"}`,
    "",
    "## Risultati",
    `Punteggio CFML: ${concept.cfml.toFixed(1)}`,
    `Livello di consolidamento: L${consolidationLevel}`,
    `Punteggio SP: ${concept.sp.toFixed(1)}`,
    `Quadrante: ${quadrant}`,
    "",
    "## Medie per dimensione SP",
    dimensionLines,
    "",
    `Numero di risposte SP: ${concept.spResponses}`,
    `Data di raccolta: ${formatCollectedAt(options.collectedAt)}`,
    "",
    "## Istruzioni di lettura",
    rules,
  ].join("\n");
}
