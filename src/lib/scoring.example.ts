import { calculateCFML, isLevelUnlocked, type CFMLAnswers } from "./scoring";

function allAnswers(value: CFMLAnswers[keyof CFMLAnswers]): CFMLAnswers {
  return {
    "1A": value,
    "1B": value,
    "2A": value,
    "2B": value,
    "2C": value,
    "3A": value,
    "3B": value,
    "3C": value,
    "4A": value,
    "4B": value,
    "5A": value,
    "5B": value,
    "5C": value,
    "6A": value,
    "6B": value,
    "6C": value,
  };
}

function logCase(title: string, result: unknown): void {
  console.log(`\n${"=".repeat(60)}`);
  console.log(title);
  console.log("=".repeat(60));
  console.log(JSON.stringify(result, null, 2));
}

// CASO 1 — Tutte "no"
// Aspettato: score=0, level=0, tutti i levelConsolidation=false
logCase(
  'CASO 1 — Tutte "no"',
  calculateCFML(allAnswers("no"))
);

// CASO 2 — Tutte "yes"
// Aspettato: score=100, level=6, tutti i levelConsolidation=true
logCase(
  'CASO 2 — Tutte "yes"',
  calculateCFML(allAnswers("yes"))
);

// CASO 3 — Solo L1 consolidato
// Aspettato: score=12, level=1, L1=true e tutti gli altri=false
logCase(
  "CASO 3 — Solo L1 consolidato",
  calculateCFML({
    ...allAnswers("no"),
    "1A": "yes",
    "1B": "yes",
  })
);

// CASO 4 — L1+L2 consolidati, L3 rotto con parziali
// Aspettato: score=34.0 (12 + 16 + 6.0), level=2
// L1=true, L2=true, L3=false, L4=true, L5=true, L6=true
logCase(
  "CASO 4 — L1+L2 consolidati, L3 rotto con parziali",
  calculateCFML({
    "1A": "yes",
    "1B": "yes",
    "2A": "yes",
    "2B": "yes",
    "2C": "yes",
    "3A": "partial",
    "3B": "partial",
    "3C": "no",
    "4A": "yes",
    "4B": "yes",
    "5A": "yes",
    "5B": "yes",
    "5C": "yes",
    "6A": "yes",
    "6B": "yes",
    "6C": "yes",
  })
);

// CASO 5 — L1 consolidato con un parziale
// Aspettato: score=9.0, level=0, L1=false
logCase(
  "CASO 5 — L1 con un solo yes (non consolidato)",
  calculateCFML({
    ...allAnswers("no"),
    "1A": "yes",
    "1B": "partial",
  })
);

// CASO 6 — Sequenza completa fino a L4
// Aspettato: L1=12, L2=13.33, L3=18, L4=18, L5=0, L6=0
// score=61.3, level=4
logCase(
  "CASO 6 — Sequenza completa fino a L4",
  calculateCFML({
    "1A": "yes",
    "1B": "yes",
    "2A": "yes",
    "2B": "yes",
    "2C": "partial",
    "3A": "yes",
    "3B": "yes",
    "3C": "yes",
    "4A": "yes",
    "4B": "yes",
    "5A": "no",
    "5B": "no",
    "5C": "no",
    "6A": "no",
    "6B": "no",
    "6C": "no",
  })
);

// isLevelUnlocked — risposte vuote: solo L1 true
// Aspettato: L1=true, L2-L6=false
logCase("isLevelUnlocked — risposte vuote {}", {
  L1: isLevelUnlocked(1, {}),
  L2: isLevelUnlocked(2, {}),
  L3: isLevelUnlocked(3, {}),
  L4: isLevelUnlocked(4, {}),
  L5: isLevelUnlocked(5, {}),
  L6: isLevelUnlocked(6, {}),
});

// isLevelUnlocked — L1 consolidato: L1 e L2 true
// Aspettato: L1=true, L2=true, L3-L6=false
logCase("isLevelUnlocked — L1 = yes, yes", {
  L1: isLevelUnlocked(1, { "1A": "yes", "1B": "yes" }),
  L2: isLevelUnlocked(2, { "1A": "yes", "1B": "yes" }),
  L3: isLevelUnlocked(3, { "1A": "yes", "1B": "yes" }),
  L4: isLevelUnlocked(4, { "1A": "yes", "1B": "yes" }),
  L5: isLevelUnlocked(5, { "1A": "yes", "1B": "yes" }),
  L6: isLevelUnlocked(6, { "1A": "yes", "1B": "yes" }),
});

// isLevelUnlocked — L1,L2,L3 consolidati: L1-L4 true, L5,L6 false
// Aspettato: L1-L4=true, L5=false, L6=false
logCase("isLevelUnlocked — L1,L2,L3 consolidati", {
  L1: isLevelUnlocked(1, {
    "1A": "yes",
    "1B": "yes",
    "2A": "yes",
    "2B": "yes",
    "2C": "yes",
    "3A": "yes",
    "3B": "yes",
    "3C": "yes",
  }),
  L2: isLevelUnlocked(2, {
    "1A": "yes",
    "1B": "yes",
    "2A": "yes",
    "2B": "yes",
    "2C": "yes",
    "3A": "yes",
    "3B": "yes",
    "3C": "yes",
  }),
  L3: isLevelUnlocked(3, {
    "1A": "yes",
    "1B": "yes",
    "2A": "yes",
    "2B": "yes",
    "2C": "yes",
    "3A": "yes",
    "3B": "yes",
    "3C": "yes",
  }),
  L4: isLevelUnlocked(4, {
    "1A": "yes",
    "1B": "yes",
    "2A": "yes",
    "2B": "yes",
    "2C": "yes",
    "3A": "yes",
    "3B": "yes",
    "3C": "yes",
  }),
  L5: isLevelUnlocked(5, {
    "1A": "yes",
    "1B": "yes",
    "2A": "yes",
    "2B": "yes",
    "2C": "yes",
    "3A": "yes",
    "3B": "yes",
    "3C": "yes",
  }),
  L6: isLevelUnlocked(6, {
    "1A": "yes",
    "1B": "yes",
    "2A": "yes",
    "2B": "yes",
    "2C": "yes",
    "3A": "yes",
    "3B": "yes",
    "3C": "yes",
  }),
});
