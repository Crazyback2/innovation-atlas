import type { Concept } from "@/src/data/concepts";
import { getQuadrant } from "@/src/data/concepts";

export function getQuadrantEvocativeLabel(concept: Concept): [string, string] {
  const { cfml, sp } = concept;

  if (cfml >= 50 && sp >= 50) return ["FORMA", "COMPIUTA"];
  if (cfml >= 50 && sp < 50) return ["IN CERCA", "DI SENSO"];
  if (cfml < 50 && sp >= 50) return ["DESIDERABILE", "MA IMMATURO"];
  return ["IDEA", "EMBRIONALE"];
}

export function getQuadrantGridCell(quadrant: ReturnType<typeof getQuadrant>): number {
  switch (quadrant) {
    case "Q1":
      return 1;
    case "Q2":
      return 0;
    case "Q3":
      return 3;
    case "Q4":
      return 2;
  }
}
