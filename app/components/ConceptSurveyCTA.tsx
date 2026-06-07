import type { Concept } from "@/src/data/concepts";

interface Props {
  concept: Concept;
}

const SURVEY_BTN =
  "flex h-[29px] w-[109px] items-center justify-center border border-fg-primary bg-accent-secondary px-[12px] pt-[8px] pb-[7px] font-mono text-metadata text-bg-elevated leading-none";

const CONSTRUCTION_W = 245;
const CONSTRUCTION_H = 180;
const DIAGONAL_LENGTH = Math.hypot(CONSTRUCTION_W, CONSTRUCTION_H);
const DIAGONAL_ANGLE = Math.atan2(CONSTRUCTION_H, CONSTRUCTION_W) * (180 / Math.PI);

function ConstructionZone() {
  return (
    <div className="relative h-full w-[245px] shrink-0 overflow-hidden border-t border-r border-b border-dashed border-fg-primary">
      <div
        className="pointer-events-none absolute left-0 top-0 w-0 border-l border-dashed border-fg-primary"
        style={{
          height: `${DIAGONAL_LENGTH}px`,
          transform: `rotate(${DIAGONAL_ANGLE}deg)`,
          transformOrigin: "0 0",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

export default function ConceptSurveyCTA({ concept }: Props) {
  return (
    <div className="relative w-[1160px]">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 border-l border-dashed border-fg-primary"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 border-r border-dashed border-fg-primary"
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
            <button type="button" className={`${SURVEY_BTN} mx-auto mt-[22px]`}>
              Compila SP
            </button>
          </div>
        </div>

        <ConstructionZone />
      </div>

      <div className="h-[64px]" aria-hidden="true" />
    </div>
  );
}
