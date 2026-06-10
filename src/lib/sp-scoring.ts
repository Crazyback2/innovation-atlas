import type {
  SPConfig,
  SPAnswers,
  SPResult,
  SPDimensionScore,
} from "@/src/data/sp-config/types";

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function normalizeScore(
  mean: number,
  scaleMin: number,
  scaleMax: number
): number {
  return round1(((mean - scaleMin) / (scaleMax - scaleMin)) * 100);
}

function correctValue(
  value: number,
  reverseScored: boolean,
  scaleMin: number,
  scaleMax: number
): number {
  // Inversione item reverse-scored (es. I2): valore alto = segnale negativo
  if (reverseScored) {
    return scaleMin + scaleMax - value;
  }
  return value;
}

function scoreDimension(
  dimension: SPConfig["dimensions"][number],
  answers: SPAnswers,
  scaleMin: number,
  scaleMax: number
): SPDimensionScore {
  const correctedValues: number[] = [];

  for (const item of dimension.items) {
    const raw = answers[item.id];
    if (typeof raw !== "number") {
      continue;
    }

    correctedValues.push(
      correctValue(raw, item.reverseScored, scaleMin, scaleMax)
    );
  }

  if (correctedValues.length === 0) {
    return {
      dimensionId: dimension.id,
      title: dimension.title,
      score: 0,
      mean: scaleMin,
    };
  }

  const mean =
    correctedValues.reduce((sum, value) => sum + value, 0) /
    correctedValues.length;

  return {
    dimensionId: dimension.id,
    title: dimension.title,
    score: normalizeScore(mean, scaleMin, scaleMax),
    mean: round1(mean),
  };
}

/**
 * Calcola il punteggio SP per un singolo rispondente.
 * - Ignora chiavi non numeriche (es. "R5_open").
 * - Inverte gli item con reverseScored=true PRIMA della media: valueCorrected = (scaleMin + scaleMax) - value
 *   (con scaleMin=1, scaleMax=7 → valueCorrected = 8 - value)
 * - Per ogni dimensione: media degli item presenti → normalizza in 0..100 con ((mean - scaleMin) / (scaleMax - scaleMin)) * 100
 * - Totale SP = media aritmetica dei 6 punteggi di dimensione
 * - Tutti i numeri restituiti sono arrotondati a 1 decimale
 *
 * Comportamento su risposte mancanti:
 * - Se un item della config manca dalle answers, viene IGNORATO nella media di dimensione (non conta).
 * - Se TUTTI gli item di una dimensione mancano, score=0 e mean=scaleMin (segnala dimensione non risposta).
 * - In questo task non valido completezza: lo farà il wizard a monte.
 */
export function calculateSP(answers: SPAnswers, config: SPConfig): SPResult {
  const { scaleMin, scaleMax } = config;

  const perDimension = config.dimensions.map((dimension) =>
    scoreDimension(dimension, answers, scaleMin, scaleMax)
  );

  const total = round1(
    perDimension.reduce((sum, dimensionScore) => sum + dimensionScore.score, 0) /
      perDimension.length
  );

  return { perDimension, total };
}

/**
 * Aggrega più SPResult (uno per rispondente) in un risultato medio di campione.
 * Per ogni dimensione: media dei punteggi individuali.
 * Totale: media dei totali individuali.
 * Tutti i numeri arrotondati a 1 decimale.
 * Se results è vuoto, throw new Error("Nessuna risposta da aggregare").
 */
export function aggregateSP(results: SPResult[], config: SPConfig): SPResult {
  if (results.length === 0) {
    throw new Error("Nessuna risposta da aggregare");
  }

  const perDimension = config.dimensions.map((dimension, index) => {
    const scores = results.map((result) => result.perDimension[index].score);
    const means = results.map((result) => result.perDimension[index].mean);

    return {
      dimensionId: dimension.id,
      title: dimension.title,
      score: round1(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      mean: round1(means.reduce((sum, mean) => sum + mean, 0) / means.length),
    };
  });

  const total = round1(
    results.reduce((sum, result) => sum + result.total, 0) / results.length
  );

  return { perDimension, total };
}
