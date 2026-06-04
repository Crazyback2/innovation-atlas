"use client";

import { useState } from "react";
import type { Concept } from "@/src/data/concepts";

// ── Fixed chart-box dimensions (pixel-exact) ─────────────────────────────────
const CHART_W = 882;
const CHART_H = 482;

// ── Container column widths (total = 1248 px) ────────────────────────────────
// Equal Y/legend columns center the chart box in the 1248 px container,
// which is also centered in the viewport → chart visually centered on the site.
const SIDE = Math.floor((1248 - CHART_W) / 2);  // (1248 - 882) / 2 = 183
const Y_COL   = SIDE;   // 183
const LEG_COL = SIDE;   // 183  →  183 + 882 + 183 = 1248 ✓

// ── Distance from section top to chart top border ────────────────────────────
// This equals the gap from the stats-section bottom to the chart border.
// The stats section has pb=0 (set in page.tsx), so this is the full visual gap.
const CHART_TOP    = 64;
const CHART_BOTTOM = CHART_TOP + CHART_H - 1;  // 545 — 1 px above outer bottom edge

// ── Bubble radius — three fixed tiers (no continuous scale) ─────────────────
// 10–29 → small · 30–74 → medium · 75+ → large
const TIER_R = [9, 16, 28] as const;
const LEGEND_MAX_R = TIER_R[2];

function tierRadius(resp: number): number {
  if (resp >= 75) return TIER_R[2];
  if (resp >= 30) return TIER_R[1];
  return TIER_R[0];
}

// Axis titles from outer 1 px matrix border — CFML below, SP group to the left
const CHART_TO_AXIS_LABEL = 32;
const SP_AXIS_GAP = 20;
const MATRIX_BORDER_W = 1;
const TICK_CHART_GAP = 6;

// ── Chart-local coordinate mapping ───────────────────────────────────────────
// These produce pixel positions WITHIN the 882×482 chart SVG.
function toX(cfml: number): number { return (cfml / 100) * CHART_W; }
function toY(sp: number): number   { return (1 - sp / 100) * CHART_H; }

// Centre-cross positions (CFML=50, SP=50)
const CX = toX(50);  // 441
const CY = toY(50);  // 241

function quadrantLabel(cfml: number, sp: number): string {
  if (cfml < 50 && sp >= 50) return "Promessa simbolica";
  if (cfml >= 50 && sp >= 50) return "Concept allineato";
  if (cfml < 50 && sp < 50) return "Idea embrionale";
  return "In cerca di senso";
}

// ── Info icon — HTML, identical to the landing Matrix style ──────────────────
function InfoIcon() {
  return (
    <div className="w-[18px] h-[18px] rounded-full border border-accent-secondary flex items-center justify-center shrink-0">
      <span className="font-mono text-[11px] text-accent-secondary leading-none">i</span>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props { concepts: Concept[] }

// ── Component ─────────────────────────────────────────────────────────────────
export default function MatrixChart({ concepts }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = concepts.filter((c) => c.spResponses >= 10);

  const bubbles = filtered.map((c) => ({
    ...c,
    bx: toX(c.cfml),
    by: toY(c.sp),
    r:  tierRadius(c.spResponses),
  }));

  const hovered = bubbles.find((b) => b.id === hoveredId) ?? null;

  const legendItems = [
    { v: 10, r: TIER_R[0], label: "≥10" },
    { v: 30, r: TIER_R[1], label: "≥30" },
    { v: 75, r: TIER_R[2], label: "≥75" },
  ];

  // Tooltip flip logic (chart-local coordinates)
  const flipX = hovered ? hovered.bx / CHART_W > 0.55 : false;
  const flipY = hovered ? hovered.by / CHART_H < 0.30 : false;

  const X_TICKS = [0, 25, 50, 75, 100];
  const Y_TICKS = [100, 75, 50, 25];

  return (
    <section className="relative w-full bg-bg-primary">

      {/* ════════════════════════════════════════════════════════════════
          FULL-VIEWPORT DASHED LINES at the chart top and bottom borders.
          The chart box (bg-bg-primary + solid border) sits on top of these
          in DOM order and visually covers them within the chart area,
          making them appear only in the left/right margins.
      ════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-x-0 border-t border-dashed border-fg-primary pointer-events-none"
        style={{ top: CHART_TOP }}
      />
      <div
        className="absolute inset-x-0 border-t border-dashed border-fg-primary pointer-events-none"
        style={{ top: CHART_BOTTOM }}
      />

      {/* ── Centered 1248 px container ── */}
      <div className="mx-auto" style={{ maxWidth: 1248 }}>

        {/* ── Content wrapper: paddingTop = CHART_TOP creates the 64px gap ── */}
        <div style={{ paddingTop: CHART_TOP, paddingBottom: 64 }}>

          {/* ═══════════════════════════════════════════════════════════
              MAIN ROW: Y-axis column | chart box | legend column
          ═══════════════════════════════════════════════════════════ */}
          <div className="flex items-start">

            {/* ── Y-axis column ── */}
            <div
              className="relative shrink-0"
              style={{ width: Y_COL, height: CHART_H }}
            >
              {/* Tick labels — vertically centred on their chart-y position */}
              {Y_TICKS.map((sp) => (
                <p
                  key={`yt-${sp}`}
                  className="absolute font-mono text-metadata text-fg-primary leading-normal bg-bg-primary"
                  style={{
                    right: 6,
                    top: toY(sp),
                    transform: "translateY(-50%)",
                    whiteSpace: "nowrap",
                    paddingLeft: 2,
                    paddingRight: 2,
                  }}
                >
                  {sp === 100 ? "100" : String(sp).padStart(2, "0")}
                </p>
              ))}
            </div>

            {/* ════════════════════════════════════════════════════════
                CHART BOX — exactly 882 × 482 px
                Wrapper aligns SP to the outer 1 px left border of the matrix.
            ════════════════════════════════════════════════════════ */}
            <div
              className="relative shrink-0 overflow-visible"
              style={{ width: CHART_W, height: CHART_H }}
            >
              <div
                className="relative size-full overflow-visible bg-bg-primary border border-fg-primary"
                style={{ borderWidth: MATRIX_BORDER_W }}
              >
              {/* SP group — 20 px from matrix left; icon 8 px above label top (after −90° rotation) */}
              <div
                className="absolute top-0 z-10 flex items-center justify-end pointer-events-none"
                style={{
                  right: `calc(100% + ${SP_AXIS_GAP}px)`,
                  height: CHART_H,
                }}
              >
                <div
                  className="flex items-center gap-[8px] whitespace-nowrap bg-bg-primary px-[2px]"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "center center" }}
                >
                  <p
                    className="font-sans text-fg-primary uppercase"
                    style={{ fontSize: 20, lineHeight: 1 }}
                  >
                    <strong>SP</strong>: PERCEZIONE SIMBOLICA
                  </p>
                  <InfoIcon />
                </div>
              </div>
              {/* SVG fills the box exactly — viewBox matches physical size */}
              <svg
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                width={CHART_W}
                height={CHART_H}
                style={{ display: "block", overflow: "visible" }}
                aria-hidden="true"
              >
                {/* ── Regular grid: verticals at CFML 25, 75 ── */}
                {[25, 75].map((v) => (
                  <line
                    key={`xg-${v}`}
                    x1={toX(v)} y1={0} x2={toX(v)} y2={CHART_H}
                    stroke="#e3e3e3" strokeWidth="0.75" strokeDasharray="4 3"
                  />
                ))}

                {/* ── Regular grid: horizontals at SP 25, 75 ── */}
                {[25, 75].map((v) => (
                  <line
                    key={`yg-${v}`}
                    x1={0} y1={toY(v)} x2={CHART_W} y2={toY(v)}
                    stroke="#e3e3e3" strokeWidth="0.75" strokeDasharray="4 3"
                  />
                ))}

                {/* ── Centre cross — CFML=50, SP=50 — dotted, more prominent ── */}
                <line
                  x1={CX} y1={0} x2={CX} y2={CHART_H}
                  stroke="#171717" strokeWidth="0.75" strokeDasharray="2 2"
                />
                <line
                  x1={0} y1={CY} x2={CHART_W} y2={CY}
                  stroke="#171717" strokeWidth="0.75" strokeDasharray="2 2"
                />

                {/* ── Quadrant labels ── */}
                <text x={8}            y={14}         fontFamily="'Geist Mono',monospace" fontSize="10" fill="#171717">Promessa simbolica</text>
                <text x={CHART_W - 8} y={14}         fontFamily="'Geist Mono',monospace" fontSize="10" fill="#171717" textAnchor="end">Concept allineato</text>
                <text x={8}            y={CHART_H - 7} fontFamily="'Geist Mono',monospace" fontSize="10" fill="#171717">Idea embrionale</text>
                <text x={CHART_W - 8} y={CHART_H - 7} fontFamily="'Geist Mono',monospace" fontSize="10" fill="#171717" textAnchor="end">In cerca di senso</text>

                {/* ════════════════════════════════════════════════════
                    BUBBLES
                    Non-hovered first → hovered last = always on top.
                ════════════════════════════════════════════════════ */}
                {bubbles
                  .filter((b) => b.id !== hoveredId)
                  .map((b) => (
                    <circle
                      key={b.id}
                      cx={b.bx} cy={b.by} r={b.r}
                      fill="white" stroke="#171717" strokeWidth="1"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoveredId(b.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    />
                  ))}

                {hovered && (
                  <circle
                    cx={hovered.bx} cy={hovered.by} r={hovered.r}
                    fill="#d0ff00" stroke="#171717" strokeWidth="1"
                    style={{
                      cursor: "pointer",
                      transformOrigin: `${hovered.bx}px ${hovered.by}px`,
                      transform: "scale(1.1)",
                      transition: "transform 150ms ease-out",
                    }}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                )}
              </svg>

              {/* ── HTML Tooltip overlay (absolute within chart box) ── */}
              {hovered && (
                <div
                  className="absolute z-10 pointer-events-none"
                  style={{
                    left: hovered.bx,
                    top:  hovered.by,
                    transform: [
                      flipX ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
                      flipY ? "translateY(12px)" : "translateY(-50%)",
                    ].join(" "),
                  }}
                >
                  <div
                    className="bg-fg-primary text-bg-elevated border border-fg-primary"
                    style={{ padding: "8px 10px", minWidth: 152 }}
                  >
                    <p className="font-heading font-bold leading-normal uppercase" style={{ fontSize: 11 }}>
                      {hovered.title}
                    </p>
                    <p className="font-mono leading-normal mt-[2px]" style={{ fontSize: 10, opacity: 0.6 }}>
                      {hovered.sector}
                    </p>
                    <div className="mt-[6px] flex flex-col gap-[2px]">
                      <p className="font-mono leading-normal" style={{ fontSize: 10 }}>CFML: {hovered.cfml}</p>
                      <p className="font-mono leading-normal" style={{ fontSize: 10 }}>SP: {hovered.sp}</p>
                      <p className="font-mono leading-normal" style={{ fontSize: 10 }}>su {hovered.spResponses} risposte</p>
                    </div>
                    <p className="font-mono leading-normal mt-[6px]" style={{ fontSize: 10, color: "#d0ff00" }}>
                      {quadrantLabel(hovered.cfml, hovered.sp)}
                    </p>
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* ── Legend column ── */}
            <div
              className="relative shrink-0"
              style={{ width: LEG_COL, height: CHART_H }}
            >
              {/* Stacked flex column, pinned to bottom-left of the legend column */}
              <div
                className="absolute flex flex-col"
                style={{ left: 18, bottom: 12, gap: 10 }}
              >
                {legendItems.map(({ v, r, label }) => (
                  <div key={v} className="flex items-center" style={{ gap: 8, minHeight: r * 2 + 2 }}>
                    <div
                      className="flex items-center justify-center"
                      style={{ width: LEGEND_MAX_R * 2, flexShrink: 0 }}
                    >
                      <svg
                        width={r * 2} height={r * 2}
                        viewBox={`0 0 ${r * 2} ${r * 2}`}
                        aria-hidden="true"
                      >
                        <circle
                          cx={r} cy={r} r={r - 0.5}
                          fill="white" stroke="#171717" strokeWidth="1"
                        />
                      </svg>
                    </div>
                    <span className="font-mono text-metadata text-fg-primary leading-normal">{label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end main row */}

          {/* ═══════════════════════════════════════════════════════════
              X-AXIS ROW (below chart, aligned with chart left edge)
          ═══════════════════════════════════════════════════════════ */}
          <div
            className="relative"
            style={{ marginLeft: Y_COL, width: CHART_W, paddingTop: TICK_CHART_GAP }}
          >
            {/* Tick labels */}
            {X_TICKS.map((cfml) => (
              <p
                key={`xt-${cfml}`}
                className="absolute font-mono text-metadata text-fg-primary leading-normal"
                style={{ left: toX(cfml), top: 0, transform: "translateX(-50%)" }}
              >
                {cfml === 0 ? "00" : String(cfml)}
              </p>
            ))}

            {/* X-axis label + info icon — centred at CFML=50 */}
            <div
              className="absolute flex items-center gap-[6px] bg-bg-primary px-[4px]"
              style={{ left: toX(50), top: CHART_TO_AXIS_LABEL, transform: "translateX(-50%)" }}
            >
              <p
                className="font-sans text-fg-primary uppercase whitespace-nowrap"
                style={{ fontSize: 20, lineHeight: 1 }}
              >
                <strong>CFML</strong>: MATURITÀ FUNZIONALE
              </p>
              <InfoIcon />
            </div>
          </div>

        </div>{/* end content wrapper */}
      </div>{/* end container */}
    </section>
  );
}
