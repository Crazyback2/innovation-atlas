import Link from "next/link";
import type { Concept } from "@/src/data/concepts";

interface Props {
  concept: Concept;
  publicToken?: string | null;
}

const SURVEY_BTN =
  "flex h-[29px] w-[109px] items-center justify-center border border-fg-primary bg-accent-secondary px-[12px] pt-[8px] pb-[7px] font-mono text-metadata text-bg-elevated leading-none";

const CONSTRUCTION_W = 245;
const CONSTRUCTION_H = 180;

function ConstructionZone() {
  return (
    <div className="relative h-full w-[245px] shrink-0 overflow-hidden border-t border-b border-dashed border-fg-primary">
      <svg
        viewBox={`0 0 ${CONSTRUCTION_W} ${CONSTRUCTION_H}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full text-fg-primary"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="0"
          x2={CONSTRUCTION_W}
          y2={CONSTRUCTION_H}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default function ConceptSurveyCTA({ concept, publicToken }: Props) {
  if (!publicToken) {
    return null;
  }

  return (
    <div className="relative w-[1160px]">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 border-l border-dashed border-fg-primary"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-0 h-[244px] border-r border-dashed border-fg-primary"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[64px] border-r border-dashed border-fg-primary"
        aria-hidden="true"
      />

      <div className="h-[64px]" aria-hidden="true" />

      <div className="flex h-[180px]">
        <div className="flex h-full w-[915px] shrink-0 border border-fg-primary bg-bg-elevated">
          <div className="flex w-[554px] shrink-0 items-center px-[30px] py-[30px]">
            <h2 className="font-heading text-h1 font-bold uppercase leading-[60px] text-fg-primary">
              PARTECIPA AL
              <br />
              SONDAGGIO
            </h2>
          </div>

          <div
            className="my-[35px] w-px shrink-0 bg-fg-primary"
            aria-hidden="true"
          />

          <div className="flex flex-1 flex-col items-center justify-center px-[27px]">
            <p className="text-center font-sans text-body leading-normal text-fg-primary">
              Aiuta a misurare la percezione simbolica di {concept.title}:
            </p>
            <Link
              href={`/sp/${publicToken}`}
              className={`${SURVEY_BTN} mx-auto mt-[22px]`}
            >
              Compila SP
            </Link>
          </div>
        </div>

        <ConstructionZone />
      </div>

      <div className="h-[64px]" aria-hidden="true" />
    </div>
  );
}
