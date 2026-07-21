import type { SPAnswers, SPConfig, SPResult } from "@/src/data/sp-config/types";
import { CFML_LEVELS } from "@/app/concept/[id]/cfml/questions";
import {
  CFML_ANSWER_VALUES,
  type CFMLAnswers,
  type CFMLResult,
} from "@/src/lib/scoring";

const CSV_BOM = "\uFEFF";

const CFML_ANSWER_LABELS = {
  no: "No",
  partial: "Parzialmente",
  yes: "Si",
} as const;

export type CsvExportMeta = {
  conceptName: string;
  exportDate: string;
  surveyId: string;
  spConfigVersion: string;
};

function escapeCsvField(value: string | number): string {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function joinCsvRows(rows: (string | number)[][]): string {
  return (
    CSV_BOM +
    rows.map((row) => row.map(escapeCsvField).join(",")).join("\r\n")
  );
}

function metaRows(meta: CsvExportMeta): (string | number)[][] {
  return [
    ["Concept", meta.conceptName],
    ["Data esportazione", meta.exportDate],
    ["Survey id", meta.surveyId],
    ["Versione config SP", meta.spConfigVersion],
    [],
  ];
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Stessa inversione di correctValue in sp-scoring.ts
 * (valueCorrected = scaleMin + scaleMax - value). Non duplicare altrove.
 */
function correctSpValue(
  value: number,
  reverseScored: boolean,
  scaleMin: number,
  scaleMax: number
): number {
  if (reverseScored) {
    return scaleMin + scaleMax - value;
  }
  return value;
}

function spItemText(item: SPConfig["dimensions"][number]["items"][number]): string {
  if (item.statement) {
    return item.statement;
  }
  if (item.poleLow && item.poleHigh) {
    return `${item.poleLow} / ${item.poleHigh}`;
  }
  return item.id;
}

export function exportCfmlCsv(
  meta: CsvExportMeta,
  answers: CFMLAnswers,
  result: CFMLResult
): string {
  const rows: (string | number)[][] = [
    ...metaRows(meta),
    ["Livello", "Domanda", "Risposta", "Valore"],
  ];

  for (const level of CFML_LEVELS) {
    for (const question of level.questions) {
      const answer = answers[question.code as keyof CFMLAnswers];
      rows.push([
        `L${level.level}`,
        question.text,
        CFML_ANSWER_LABELS[answer],
        CFML_ANSWER_VALUES[answer],
      ]);
    }
  }

  rows.push([]);
  rows.push(["Riepilogo", "Valore"]);

  for (const key of ["L1", "L2", "L3", "L4", "L5", "L6"] as const) {
    rows.push([`Punteggio ${key}`, result.perLevelScores[key]]);
  }

  rows.push(["Punteggio totale", result.score]);
  rows.push([
    "Livello di consolidamento raggiunto",
    `L${result.level}`,
  ]);

  return joinCsvRows(rows);
}

export function exportSpCsv(
  meta: CsvExportMeta,
  config: SPConfig,
  responseAnswers: SPAnswers[],
  aggregate: SPResult
): string {
  const { scaleMin, scaleMax } = config;
  const rows: (string | number)[][] = [
    ...metaRows(meta),
    ["Dimensione", "Item", "Media", "N risposte"],
  ];

  for (const dimension of config.dimensions) {
    for (const item of dimension.items) {
      const corrected: number[] = [];

      for (const answers of responseAnswers) {
        const raw = answers[item.id];
        if (typeof raw !== "number") {
          continue;
        }
        corrected.push(
          correctSpValue(raw, item.reverseScored, scaleMin, scaleMax)
        );
      }

      const mean =
        corrected.length === 0
          ? ""
          : round1(
              corrected.reduce((sum, value) => sum + value, 0) /
                corrected.length
            );

      rows.push([
        dimension.title,
        spItemText(item),
        mean,
        corrected.length,
      ]);
    }
  }

  rows.push([]);
  rows.push(["Riepilogo", "Valore"]);

  for (const dimensionScore of aggregate.perDimension) {
    rows.push([`Media ${dimensionScore.title}`, dimensionScore.mean]);
  }

  rows.push(["Punteggio SP totale", aggregate.total]);

  return joinCsvRows(rows);
}

export function exportMatriceCsv(
  meta: CsvExportMeta,
  data: {
    cfml: number;
    sp: number;
    quadrant: "Q1" | "Q2" | "Q3" | "Q4";
    spResponses: number;
    quadrantReading: string;
  }
): string {
  return joinCsvRows([
    ...metaRows(meta),
    ["Campo", "Valore"],
    ["Punteggio CFML", data.cfml],
    ["Punteggio SP", data.sp],
    ["Quadrante", data.quadrant],
    ["N risposte SP", data.spResponses],
    ["Lettura del quadrante", data.quadrantReading],
  ]);
}

export function buildCsvExportMeta(input: {
  conceptName: string;
  surveyId: string | null;
  spConfigVersion: string | null;
  exportDate?: string;
}): CsvExportMeta {
  return {
    conceptName: input.conceptName,
    exportDate:
      input.exportDate ?? new Date().toISOString().slice(0, 10),
    surveyId: input.surveyId ?? "",
    spConfigVersion: input.spConfigVersion ?? "",
  };
}
