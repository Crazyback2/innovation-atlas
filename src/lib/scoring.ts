export type CFMLAnswer = "no" | "partial" | "yes";

export type CFMLAnswers = {
  "1A": CFMLAnswer;
  "1B": CFMLAnswer;
  "2A": CFMLAnswer;
  "2B": CFMLAnswer;
  "2C": CFMLAnswer;
  "3A": CFMLAnswer;
  "3B": CFMLAnswer;
  "3C": CFMLAnswer;
  "4A": CFMLAnswer;
  "4B": CFMLAnswer;
  "5A": CFMLAnswer;
  "5B": CFMLAnswer;
  "5C": CFMLAnswer;
  "6A": CFMLAnswer;
  "6B": CFMLAnswer;
  "6C": CFMLAnswer;
};

export type CFMLLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type CFMLLevelKey = "L1" | "L2" | "L3" | "L4" | "L5" | "L6";

export type CFMLResult = {
  score: number;
  level: 0 | CFMLLevel;
  perLevelScores: {
    L1: number;
    L2: number;
    L3: number;
    L4: number;
    L5: number;
    L6: number;
  };
  levelConsolidation: {
    L1: boolean;
    L2: boolean;
    L3: boolean;
    L4: boolean;
    L5: boolean;
    L6: boolean;
  };
};

export const CFML_WEIGHTS = {
  L1: 12,
  L2: 16,
  L3: 18,
  L4: 18,
  L5: 18,
  L6: 18,
} as const;

export const CFML_LEVEL_QUESTIONS = {
  L1: ["1A", "1B"],
  L2: ["2A", "2B", "2C"],
  L3: ["3A", "3B", "3C"],
  L4: ["4A", "4B"],
  L5: ["5A", "5B", "5C"],
  L6: ["6A", "6B", "6C"],
} as const;

export const CFML_ANSWER_VALUES = {
  no: 0,
  partial: 0.5,
  yes: 1,
} as const;

const LEVEL_KEYS: CFMLLevelKey[] = ["L1", "L2", "L3", "L4", "L5", "L6"];

function getLevelKey(level: CFMLLevel): CFMLLevelKey {
  return `L${level}` as CFMLLevelKey;
}

function countYesAnswers(
  questions: readonly (keyof CFMLAnswers)[],
  answers: Partial<CFMLAnswers>
): number {
  return questions.reduce((count, question) => {
    return answers[question] === "yes" ? count + 1 : count;
  }, 0);
}

function isLevelConsolidated(
  level: CFMLLevel,
  answers: Partial<CFMLAnswers>
): boolean {
  const questions = CFML_LEVEL_QUESTIONS[getLevelKey(level)];
  return countYesAnswers(questions, answers) >= 2;
}

function calculateLevelScore(
  level: CFMLLevel,
  answers: CFMLAnswers
): number {
  const levelKey = getLevelKey(level);
  const questions = CFML_LEVEL_QUESTIONS[levelKey];
  const sum = questions.reduce((total, question) => {
    return total + CFML_ANSWER_VALUES[answers[question]];
  }, 0);
  return (sum / questions.length) * CFML_WEIGHTS[levelKey];
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function isLevelUnlocked(
  level: CFMLLevel,
  answers: Partial<CFMLAnswers>
): boolean {
  if (level === 1) {
    return true;
  }
  return isLevelConsolidated((level - 1) as CFMLLevel, answers);
}

export function calculateCFML(answers: CFMLAnswers): CFMLResult {
  const perLevelScores: CFMLResult["perLevelScores"] = {
    L1: 0,
    L2: 0,
    L3: 0,
    L4: 0,
    L5: 0,
    L6: 0,
  };

  const levelConsolidation: CFMLResult["levelConsolidation"] = {
    L1: false,
    L2: false,
    L3: false,
    L4: false,
    L5: false,
    L6: false,
  };

  for (let level = 1; level <= 6; level++) {
    const levelKey = getLevelKey(level as CFMLLevel);
    perLevelScores[levelKey] = calculateLevelScore(level as CFMLLevel, answers);
    levelConsolidation[levelKey] = isLevelConsolidated(
      level as CFMLLevel,
      answers
    );
  }

  let consolidationLevel: CFMLResult["level"] = 0;
  for (let level = 1; level <= 6; level++) {
    const levelKey = getLevelKey(level as CFMLLevel);
    if (!levelConsolidation[levelKey]) {
      break;
    }
    consolidationLevel = level as CFMLLevel;
  }

  let rawTotal = 0;
  for (let level = 1; level <= 6; level++) {
    const levelKey = getLevelKey(level as CFMLLevel);
    const previousLevelsConsolidated = LEVEL_KEYS.slice(0, level - 1).every(
      (key) => levelConsolidation[key]
    );

    if (!previousLevelsConsolidated) {
      break;
    }

    rawTotal += perLevelScores[levelKey];

    if (!levelConsolidation[levelKey]) {
      break;
    }
  }

  return {
    score: roundToOneDecimal(rawTotal),
    level: consolidationLevel,
    perLevelScores,
    levelConsolidation,
  };
}
