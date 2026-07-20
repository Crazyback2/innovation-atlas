"use client";

import SPRadar from "@/app/components/SPRadar";
import type { SPDimensionScore } from "@/src/data/sp-config/types";

type Props = {
  perDimension: SPDimensionScore[];
  responseCount: number;
  minResponses: number;
};

function formatScore(value: number): string {
  return value.toFixed(1);
}

export default function SPBreakdown({
  perDimension,
  responseCount,
  minResponses,
}: Props) {
  const belowThreshold = responseCount > 0 && responseCount < minResponses;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {belowThreshold && (
        <p className="max-w-[640px] font-sans text-body leading-relaxed text-fg-primary opacity-75">
          Soglia minima non raggiunta: {responseCount} su {minResponses}{" "}
          risposte. I risultati sotto sono indicativi.
        </p>
      )}

      <SPRadar
        perDimension={perDimension}
        className="mx-auto w-full max-w-full"
      />

      <ul className="flex w-full min-w-0 flex-col">
        {perDimension.map((dimension) => (
          <li
            key={dimension.dimensionId}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-accent-tertiary py-3"
          >
            <span className="font-sans text-body uppercase leading-relaxed text-fg-primary">
              {dimension.title}
            </span>
            <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
              {formatScore(dimension.score)} / 100
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
