import type { SPDimensionScore } from "@/src/data/sp-config/types";

type Props = {
  perDimension: SPDimensionScore[];
  className?: string;
};

const VIEW_SIZE = 600;
const CX = VIEW_SIZE / 2;
const CY = VIEW_SIZE / 2;
// Ritaglio verticale del viewBox: il contenuto (etichette comprese) vive tra
// ~y=134 (etichetta in alto) e ~y=505 (etichetta in basso). Croppiamo il
// margine vuoto sopra/sotto così il radar sale e l'etichetta superiore resta
// vicina al bordo del box.
const VIEW_MIN_Y = 135;
const VIEW_HEIGHT = 378;
const MAX_RADIUS = 120;
const LABEL_RADIUS = MAX_RADIUS * 1.18;
const RING_FRACTIONS = [0.25, 0.5, 0.75, 1] as const;
const LABEL_LINE_HEIGHT = 16;

function getAxisAngle(index: number): number {
  return -90 + index * 60;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): { x: number; y: number } {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function ringPolygonPoints(fraction: number, count: number): string {
  return Array.from({ length: count }, (_, index) => {
    const { x, y } = polarToCartesian(
      CX,
      CY,
      MAX_RADIUS * fraction,
      getAxisAngle(index)
    );
    return `${x},${y}`;
  }).join(" ");
}

function profilePolygonPoints(dimensions: SPDimensionScore[]): string {
  return dimensions
    .map((dimension, index) => {
      const fraction = Math.max(0, Math.min(1, dimension.score / 100));
      const { x, y } = polarToCartesian(
        CX,
        CY,
        MAX_RADIUS * fraction,
        getAxisAngle(index)
      );
      return `${x},${y}`;
    })
    .join(" ");
}

function splitLabel(title: string): string[] {
  if (title.length <= 22) {
    return [title];
  }

  const words = title.split(" ");
  if (words.length <= 2) {
    return [title];
  }

  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function getLabelAnchor(index: number): {
  textAnchor: "start" | "middle" | "end";
  dominantBaseline: "auto" | "middle" | "hanging" | "central";
} {
  switch (index) {
    case 0:
      return { textAnchor: "middle", dominantBaseline: "hanging" };
    case 3:
      return { textAnchor: "middle", dominantBaseline: "hanging" };
    case 1:
    case 2:
      return { textAnchor: "start", dominantBaseline: "middle" };
    case 4:
    case 5:
      return { textAnchor: "end", dominantBaseline: "middle" };
    default:
      return { textAnchor: "middle", dominantBaseline: "middle" };
  }
}

export default function SPRadar({
  perDimension,
  className = "mx-auto w-full max-w-[360px] shrink-0",
}: Props) {
  const axisCount = perDimension.length;

  return (
    <svg
      viewBox={`0 ${VIEW_MIN_Y} ${VIEW_SIZE} ${VIEW_HEIGHT}`}
      overflow="visible"
      role="img"
      aria-label="Profilo SP per dimensione"
      className={className}
    >
      {RING_FRACTIONS.map((fraction) => (
        <polygon
          key={fraction}
          points={ringPolygonPoints(fraction, axisCount)}
          fill="none"
          stroke="var(--color-border-muted)"
          strokeWidth={0.75}
        />
      ))}

      {perDimension.map((_, index) => {
        const angle = getAxisAngle(index);
        const outer = polarToCartesian(CX, CY, MAX_RADIUS, angle);
        return (
          <line
            key={`axis-${index}`}
            x1={CX}
            y1={CY}
            x2={outer.x}
            y2={outer.y}
            stroke="var(--color-border-muted)"
            strokeWidth={0.75}
          />
        );
      })}

      <polygon
        points={profilePolygonPoints(perDimension)}
        fill="var(--color-accent-secondary)"
        fillOpacity={0.2}
        stroke="var(--color-accent-secondary)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {perDimension.map((dimension, index) => {
        const labelPos = polarToCartesian(CX, CY, LABEL_RADIUS, getAxisAngle(index));
        const anchor = getLabelAnchor(index);
        const lines = splitLabel(dimension.title);

        return (
          <g key={dimension.dimensionId}>
            <text
              x={labelPos.x}
              y={labelPos.y}
              textAnchor={anchor.textAnchor}
              dominantBaseline={anchor.dominantBaseline}
              fill="var(--color-fg-primary)"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-body)",
              }}
            >
              {lines.map((line, lineIndex) => (
                <tspan
                  key={lineIndex}
                  x={labelPos.x}
                  dy={lineIndex === 0 ? 0 : LABEL_LINE_HEIGHT}
                >
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
