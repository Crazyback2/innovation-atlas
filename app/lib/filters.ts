import type { Concept } from "@/src/data/concepts";
import { getQuadrant } from "@/src/data/concepts";

export type Filters = {
  search: string;
  sector: string | "all";
  quadrant: "Q1" | "Q2" | "Q3" | "Q4" | "all";
  cfmlRange: [number, number];
  spRange: [number, number];
  sort: "recent" | "most-rated" | "alphabetical";
};

export const DEFAULT_FILTERS: Filters = {
  search: "",
  sector: "all",
  quadrant: "all",
  cfmlRange: [0, 100],
  spRange: [0, 100],
  sort: "recent",
};

export const QUADRANT_OPTIONS = [
  { label: "Tutti", value: "all" as const },
  { label: "Q1", value: "Q1" as const },
  { label: "Q2", value: "Q2" as const },
  { label: "Q3", value: "Q3" as const },
  { label: "Q4", value: "Q4" as const },
];

export const SORT_OPTIONS = [
  { label: "Più recenti", value: "recent" as const },
  { label: "Più valutati", value: "most-rated" as const },
  { label: "Alfabetico", value: "alphabetical" as const },
];

export function hasActiveFilters(filters: Filters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.sector !== "all" ||
    filters.quadrant !== "all" ||
    filters.cfmlRange[0] !== 0 ||
    filters.cfmlRange[1] !== 100 ||
    filters.spRange[0] !== 0 ||
    filters.spRange[1] !== 100 ||
    filters.sort !== "recent"
  );
}

export function filtersToKey(filters: Filters): string {
  return JSON.stringify(filters);
}

function matchesSearch(concept: Concept, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  if (concept.title.toLowerCase().includes(q)) return true;
  if (concept.author.name.toLowerCase().includes(q)) return true;
  if (concept.author.handle.toLowerCase().includes(q)) return true;
  if (concept.tags.some((tag) => tag.toLowerCase().includes(q))) return true;

  return false;
}

export function applyFilters(concepts: Concept[], filters: Filters): Concept[] {
  const filtered = concepts.filter((concept) => {
    if (!matchesSearch(concept, filters.search)) return false;
    if (filters.sector !== "all" && concept.sector !== filters.sector) return false;
    if (filters.quadrant !== "all" && getQuadrant(concept) !== filters.quadrant) return false;
    if (concept.cfml < filters.cfmlRange[0] || concept.cfml > filters.cfmlRange[1]) return false;
    if (concept.sp < filters.spRange[0] || concept.sp > filters.spRange[1]) return false;
    return true;
  });

  const sorted = [...filtered];

  switch (filters.sort) {
    case "recent":
      sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      break;
    case "most-rated":
      sorted.sort((a, b) => b.spResponses - a.spResponses);
      break;
    case "alphabetical":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "it"));
      break;
  }

  return sorted;
}

export function getQuadrantLabel(quadrant: Filters["quadrant"]): string {
  return QUADRANT_OPTIONS.find((o) => o.value === quadrant)?.label ?? "Tutti";
}

export function getSortLabel(sort: Filters["sort"]): string {
  return SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Più recenti";
}

export function isDefaultRange(range: [number, number]): boolean {
  return range[0] === 0 && range[1] === 100;
}
