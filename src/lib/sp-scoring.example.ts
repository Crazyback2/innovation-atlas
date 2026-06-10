import spConfig from "@/src/data/sp-config/v1_2026-06";
import type { SPAnswers, SPResult } from "@/src/data/sp-config/types";
import { aggregateSP, calculateSP } from "./sp-scoring";

const allItemIds = spConfig.dimensions.flatMap((dimension) =>
  dimension.items.map((item) => item.id)
);

function buildAllAnswers(value: number, i2Value?: number): SPAnswers {
  const answers: SPAnswers = {};

  for (const itemId of allItemIds) {
    answers[itemId] = itemId === "I2" && i2Value !== undefined ? i2Value : value;
  }

  return answers;
}

function logSPResult(title: string, result: SPResult): void {
  console.log(`\n${title}`);
  for (const dimension of result.perDimension) {
    console.log(`  ${dimension.dimensionId}: ${dimension.score.toFixed(1)}`);
  }
  console.log(`  total: ${result.total.toFixed(1)}`);
}

// CASO A — Tutte 7 (massimo perfetto; I2=1 perché invertito → 7 corretto)
logSPResult(
  "CASO A — Tutte 7 (I2=1)",
  calculateSP(buildAllAnswers(7, 1), spConfig)
);

// CASO B — Tutte 1 (minimo perfetto; I2=7 perché invertito → 1 corretto)
logSPResult(
  "CASO B — Tutte 1 (I2=7)",
  calculateSP(buildAllAnswers(1, 7), spConfig)
);

// CASO C — Tutte 4 (centro scala), I2=4
logSPResult(
  "CASO C — Tutte 4 (I2=4)",
  calculateSP(buildAllAnswers(4, 4), spConfig)
);

// CASO D — Verifica inversione I2 (caso critico)
// Senza inversione: media identità = 7 → score 100
// Con inversione: I2=7 → 1; media = (7+1+7+7)/4 = 5.5 → score 75.0
logSPResult(
  "CASO D — Inversione I2 (I1,I2,I3,I4 = 7)",
  calculateSP(
    {
      I1: 7,
      I2: 7,
      I3: 7,
      I4: 7,
    },
    spConfig
  )
);

// CASO E — Profilo sbilanciato (estetica alta, morale bassa, altri a 4)
logSPResult(
  "CASO E — Estetica alta, morale bassa, altri a 4",
  calculateSP(
    {
      ...buildAllAnswers(4, 4),
      E1: 7,
      E2: 7,
      E3: 7,
      E4: 7,
      E5: 7,
      M1: 1,
      M2: 1,
      M3: 1,
    },
    spConfig
  )
);

// CASO F — Aggregazione 3 rispondenti
logSPResult(
  "CASO F — Aggregazione 3 rispondenti",
  aggregateSP(
    [
      calculateSP(buildAllAnswers(7, 1), spConfig),
      calculateSP(buildAllAnswers(4, 4), spConfig),
      calculateSP(buildAllAnswers(1, 7), spConfig),
    ],
    spConfig
  )
);
