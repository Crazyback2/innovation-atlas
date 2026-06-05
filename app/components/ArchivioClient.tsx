"use client";

import { useMemo, useState } from "react";
import type { Concept } from "@/src/data/concepts";
import {
  applyFilters,
  DEFAULT_FILTERS,
  filtersToKey,
  hasActiveFilters,
  type Filters,
} from "@/app/lib/filters";
import FilterToolbar from "@/app/components/FilterToolbar";
import MatrixChart from "@/app/components/MatrixChart";
import CardGrid from "@/app/components/CardGrid";

interface Props {
  concepts: Concept[];
}

function ResultCounter({
  filteredCount,
  totalCount,
  showReset,
  onReset,
}: {
  filteredCount: number;
  totalCount: number;
  showReset: boolean;
  onReset: () => void;
}) {
  const label = showReset
    ? `${filteredCount} DI ${totalCount} CONCEPT`
    : `${totalCount} CONCEPT`;

  return (
    <div className="mx-auto flex w-[1263px] items-center gap-[16px]">
      <p className="font-mono text-metadata uppercase text-fg-primary leading-normal">
        {label}
      </p>
      {showReset && (
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-metadata uppercase text-fg-primary leading-normal underline underline-offset-2 transition-colors hover:text-accent-secondary"
        >
          RESETTA FILTRI
        </button>
      )}
    </div>
  );
}

export default function ArchivioClient({ concepts }: Props) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const filteredConcepts = useMemo(
    () => applyFilters(concepts, filters),
    [concepts, filters],
  );

  const active = hasActiveFilters(filters);
  const filterKey = filtersToKey(filters);

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <>
      {/*
        Figma 04 Archivio: stats → matrice → toolbar (64 px sotto CFML) → griglia.
        MatrixChart paddingBottom (64 px) copre lo spacing CFML → blocco filtri.
        CardGrid pt-[64 px] copre lo spacing toolbar → cards (y=1114 → y=1178 in Figma).
      */}
      <MatrixChart concepts={filteredConcepts} />

      <section className="mt-[32px] w-full bg-bg-primary">
        <div className="mx-auto flex w-[1440px] flex-col items-center gap-[16px]">
          <FilterToolbar filters={filters} onChange={setFilters} />
          <ResultCounter
            filteredCount={filteredConcepts.length}
            totalCount={concepts.length}
            showReset={active}
            onReset={handleReset}
          />
        </div>
      </section>

      <CardGrid concepts={filteredConcepts} filterKey={filterKey} />
    </>
  );
}
