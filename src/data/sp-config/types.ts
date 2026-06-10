export type SPMethod = "semantic_differential" | "likert";

export type SPItemOpenTextField = {
  label: string;
  placeholder: string;
  required: boolean;
};

export type SPItem = {
  id: string;                          // es. "E1", "R3", "I2", "A4"
  // Per semantic_differential:
  poleLow?: string;                    // es. "Trascurato"
  poleHigh?: string;                   // es. "Curato"
  // Per likert:
  statement?: string;                  // es. "Capisco chiaramente che cosa sia questo concept."
  // Comune:
  reverseScored: boolean;              // true solo per I2; altrove false
  tooltip?: string;
  openTextField?: SPItemOpenTextField; // opzionale, presente su R5
};

export type SPDimension = {
  id: string;                          // "estetica" | "ruolo" | "identita" | "morale" | "relazionale" | "emozione"
  number: number;                      // 1..6, ordine di somministrazione
  title: string;                       // es. "Segnali estetici"
  description: string;                 // breve, una frase per intro nel wizard
  method: SPMethod;
  items: SPItem[];
};

export type SPConfig = {
  version: string;                     // "v1_2026-06"
  dimensions: SPDimension[];
  minResponses: number;                // 10
  scaleMin: number;                    // 1
  scaleMax: number;                    // 7
};

// Risposte di un singolo rispondente: chiave = item.id, valore = numero 1..7
// Per R5 c'è una chiave aggiuntiva "R5_open" con stringa libera (opzionale)
export type SPAnswers = Record<string, number | string>;

// Output dello scoring per dimensione
export type SPDimensionScore = {
  dimensionId: string;
  title: string;
  score: number;                       // 0..100, 1 decimale
  mean: number;                        // 1..7, 1 decimale (media grezza prima della normalizzazione)
};

// Output completo dello scoring
export type SPResult = {
  perDimension: SPDimensionScore[];    // 6 dimensioni, nell'ordine della config
  total: number;                       // 0..100, media dei 6 punteggi di dimensione, 1 decimale
};
