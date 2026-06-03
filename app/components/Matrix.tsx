// SVG coordinate system for the bubble chart:
// viewBox 0 0 885 482 — x=0 → CFML 0, x=885 → CFML 100
//                     — y=0 → SP 100 (top), y=482 → SP 0 (bottom)
// Bubble positions derived from Figma node 567:11822 pixel data.

// CSS box: left=278, top=380, w=885, h=482.
// Right outer edge at x=1163, bottom at section-y=863.
// The solid borders (1 px, border-box) land at x=1162–1163 and section-y=862–863,
// perfectly co-incident with the section-level dashed lines at those positions.
const CHART_W = 885;
const CHART_H = 482;

// Grid positions (chart-local px)
// gx[1] = Math.floor(885/2) - 1.5 = 440.5 → container-x = 278+440.5 = 718.5.
// SVG renders sub-pixel coordinates — the 0.75-px stroke is centred at 718.5,
// painting at ~718.125–718.875, bringing it flush with the section centre line.
const gx = [CHART_W * 0.25, Math.floor(CHART_W / 2) - 0.5, CHART_W * 0.75] as const; // CFML 25, 50, 75
const gy = [CHART_H * 0.25, CHART_H * 0.5, CHART_H * 0.75] as const; // SP 75, 50, 25

type Bubble = { cx: number; cy: number; r: number };

const BUBBLES: Bubble[] = [
  // ─── r 7 (≥10 tier) ───────────────────────────────────────────
  { cx: 133, cy:  97, r: 7 },
  { cx: 557, cy:  83, r: 7 },
  { cx: 112, cy: 410, r: 7 },
  { cx: 133, cy: 378, r: 7 },
  { cx: 205, cy: 420, r: 7 },
  { cx: 222, cy: 362, r: 7 },
  { cx: 250, cy: 314, r: 7 },
  { cx: 162, cy: 317, r: 7 },
  { cx: 213, cy: 181, r: 7 },
  { cx: 219, cy: 139, r: 7 },
  { cx: 326, cy: 300, r: 7 },
  { cx: 484, cy: 324, r: 7 },
  { cx: 522, cy: 203, r: 7 },
  { cx: 595, cy: 368, r: 7 },
  { cx: 629, cy: 345, r: 7 },
  { cx: 176, cy: 375, r: 7 },
  { cx: 705, cy:  70, r: 7 },
  // ─── r 13 (≥30 tier) ──────────────────────────────────────────
  { cx: 127, cy: 276, r: 13 },
  { cx: 165, cy: 217, r: 13 },
  { cx: 266, cy: 239, r: 13 },
  { cx: 343, cy: 336, r: 13 },
  { cx: 368, cy: 116, r: 13 },
  { cx: 384, cy: 136, r: 13 },
  { cx: 459, cy: 354, r: 13 },
  { cx: 496, cy: 415, r: 13 },
  { cx: 510, cy: 171, r: 13 },
  { cx: 545, cy: 231, r: 13 },
  { cx: 608, cy: 304, r: 13 },
  { cx: 636, cy: 186, r: 13 },
  { cx: 636, cy:  55, r: 13 },
  { cx: 717, cy:  45, r: 13 },
  // ─── r 22 (≥75 tier) ──────────────────────────────────────────
  { cx: 162, cy: 166, r: 22 },
  { cx: 219, cy:  68, r: 22 },
  { cx: 310, cy: 121, r: 22 },
  { cx: 315, cy: 249, r: 22 },
  { cx: 394, cy: 196, r: 22 },
  { cx: 424, cy: 280, r: 22 },
  { cx: 451, cy: 162, r: 22 },
  { cx: 504, cy: 278, r: 22 },
  { cx: 509, cy: 114, r: 22 },
  { cx: 571, cy: 187, r: 22 },
  { cx: 573, cy: 101, r: 22 },
  { cx: 654, cy: 128, r: 22 },
  { cx: 506, cy: 365, r: 22 },
  { cx: 717, cy: 339, r: 22 },
  { cx: 730, cy: 157, r: 22 },
  { cx: 792, cy:  75, r: 22 },
];

const Y_TICKS = [
  { label: "100", top: 373, left: 251 },
  { label: "75",  top: 494, left: 257 },
  { label: "50",  top: 613, left: 257 },
  { label: "25",  top: 734, left: 257 },
  { label: "00",  top: 862, left: 257 },
] as const;

const X_TICKS = [
  { label: "00",  left: 257 },
  { label: "25",  left: 494 },
  { label: "50",  left: 714 },
  { label: "75",  left: 935 },
  { label: "100", left: 1152 },
] as const;

const LEGEND = [
  { r: 7,  label: "≥ 10" },
  { r: 12, label: "≥ 30" },
  { r: 22, label: "≥ 75" },
] as const;

// ─── Info icon (violet circle with "i") ─────────────────────────
function InfoIcon() {
  return (
    <div className="w-[18px] h-[18px] rounded-full border border-accent-secondary flex items-center justify-center shrink-0">
      <span className="font-mono text-[11px] text-accent-secondary leading-none">i</span>
    </div>
  );
}

export default function Matrix() {
  return (
    <section className="w-full bg-bg-primary relative">

      {/* ── Top border (spans full viewport width) ── */}
      <div className="w-full h-px bg-fg-primary" />

      {/* ═══════════════════════════════════════════════════════════
          FULL-VIEWPORT HORIZONTAL DASHED LINES
          Positioned relative to the <section> so they span wall-to-wall
          regardless of viewport width.

          The chart box (bg-bg-primary + solid border) sits above these
          in z-order (DOM-later) and naturally covers them inside the
          chart area, so they appear to end cleanly at the chart border.

          Y values = 1 px (solid border) + container-relative y:
            y = 95  → container y = 94  (73 px above MATRICE box top 167)
            y = 381 → container y = 380 (chart top)
            y = 862 → container y = 861 (chart bottom)

          Y-axis tick labels have bg-bg-primary so the "100" label at
          container y = 373 implicitly breaks the y = 381 line.
      ═══════════════════════════════════════════════════════════ */}
      <div className="absolute w-full border-t border-dashed border-fg-primary" style={{ top: 95 }} />
      <div className="absolute w-full border-t border-dashed border-fg-primary" style={{ top: 381 }} />
      <div className="absolute w-full border-t border-dashed border-fg-primary" style={{ top: 862 }} />

      {/* ── Centered 1440-px content frame ── */}
      <div className="relative mx-auto w-[1440px] h-[1485px] overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════
          VERTICAL BACKGROUND LINES (full container height)
          Left  x = 278 → border-r renders at x 278–279 (chart left border)
          Centre x = 720 → border-l renders at x 719–720
          Right  x = 1162 → border-l renders at x 1161–1162 (chart right border)
      ═══════════════════════════════════════════════════════════ */}

      {/* Vertical — chart left */}
      <div
        className="absolute top-0 bottom-0 border-r border-dashed border-fg-primary"
        style={{ left: 278 }}
      />
      {/* Vertical — centre */}
      <div
        className="absolute top-0 bottom-0 border-l border-dashed border-fg-primary"
        style={{ left: 720 }}
      />
      {/* Vertical — chart right */}
      <div
        className="absolute top-0 bottom-0 border-l border-dashed border-fg-primary"
        style={{ left: 1162 }}
      />

      {/* ═══════════════════════════════════════════════════════════
          1 · HEADER BOX
      ═══════════════════════════════════════════════════════════ */}

      {/* Eyebrow label — Geist Mono Regular 11px
          bg-bg-primary ensures the left vertical dashed line
          doesn't bleed through the transparent text background. */}
      <p className="absolute left-[219px] top-[148px] font-mono text-metadata text-fg-primary leading-normal bg-bg-primary pr-[2px]">
        02 // MATRIX
      </p>

      {/* Header container — 1003 × 140, white, 1px black border */}
      <div className="absolute left-[219px] top-[167px] w-[1003px] h-[140px] bg-bg-elevated border border-fg-primary">

        {/* ── Crosshair / plus icon (SVG) ── */}
        {/*
          Figma lines: two horizontal arms, two vertical arms, one diagonal at 135°.
          Center ≈ (60, 70) within the box — vertically centered at h=140 → y=70.
        */}
        <svg
          aria-hidden="true"
          className="absolute left-[25px] top-1/2 -translate-y-1/2"
          width="70"
          height="62"
          viewBox="0 0 70 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left arm */}
          <line x1="0"  y1="31" x2="28" y2="31" stroke="#171717" strokeWidth="1" />
          {/* Right arm */}
          <line x1="42" y1="31" x2="70" y2="31" stroke="#171717" strokeWidth="1" />
          {/* Top arm */}
          <line x1="35" y1="0"  x2="35" y2="24" stroke="#171717" strokeWidth="1" />
          {/* Bottom arm */}
          <line x1="35" y1="38" x2="35" y2="62" stroke="#171717" strokeWidth="1" />
          {/* Diagonal (135° → top-right to bottom-left) */}
          <line x1="64" y1="3"  x2="6"  y2="59" stroke="#171717" strokeWidth="0.75" />
        </svg>

        {/* MATRICE — Geist Bold 70px / lh 60 */}
        <p className="absolute left-[114px] top-[42px] font-heading font-bold text-h1 text-fg-primary leading-[60px] uppercase">
          MATRICE
        </p>

        {/* Colour pill: gray | lime | violet | black */}
        <div className="absolute top-[65px] h-[10px] flex" style={{ left: 451 }}>
          <div className="w-[40px] h-full bg-accent-tertiary" />
          {/* lime overlaps gray by 8 px, matching Figma positions 670→710 / 702→736 */}
          <div className="w-[34px] h-full bg-accent-primary -ml-[8px]" />
          <div className="w-[13px] h-full bg-accent-secondary" />
          <div className="w-[10px] h-full bg-fg-primary" />
        </div>

        {/* Description — Space Grotesk Regular 15px */}
        <p className="absolute left-[569px] top-[43px] w-[376px] font-sans text-body text-fg-primary leading-normal">
          Strumento che incrocia due dimensioni e mostra la posizione di ogni
          concept, rivelando cosa funziona, cosa va ripensato e dove intervenire.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          2 · BUBBLE CHART  (CFML × SP)
      ═══════════════════════════════════════════════════════════ */}

      {/* ── Y-axis info icon ──
          Moved to left=227 (+22 px) so its right edge lands ≈246 px from the
          chart left (x=278), matching the 32 px gap on the CFML side. */}
      <div className="absolute left-[227px] top-[467px] w-[18px] h-[18px] rounded-full border border-accent-secondary flex items-center justify-center">
        <span className="font-mono text-[11px] text-accent-secondary leading-none">i</span>
      </div>

      {/* ── Y-axis rotated label ──
          Moved to left=236 (+22 px): right edge in page-space = 236+10 = 246.
          Gap from 246 to chart left (278) = 32 px = CFML-to-chart gap. */}
      <p
        className="absolute font-sans text-fg-primary uppercase whitespace-nowrap"
        style={{
          left: 236,
          top: 623,
          fontSize: 20,
          lineHeight: 1,
          transform: "translate(-50%, -50%) rotate(-90deg)",
        }}
      >
        <strong>SP</strong>: PERCEZIONE SIMBOLICA
      </p>

      {/* ── Y-axis tick labels ──
          bg-bg-primary gives each label a solid background.
          Most importantly, "100" at top ≈ 373 extends into the section-level
          dashed line at y = 381, so the background creates a clean implicit
          break without needing an explicit segment gap. */}
      {Y_TICKS.map(({ label, top, left }) => (
        <p
          key={`y-${label}`}
          className="absolute font-mono text-metadata text-fg-primary leading-normal bg-bg-primary"
          style={{ left, top }}
        >
          {label}
        </p>
      ))}

      {/* ── Chart area + inline SVG ── */}
      {/* Abs: left=278, top=380, w=885, h=482
          Right outer edge x=1163, border at x=1162–1163 (matches section line).
          Bottom outer edge section-y=863, border at 862–863 (matches section line). */}
      <div className="absolute left-[278px] top-[380px] w-[885px] h-[482px] border border-fg-primary bg-bg-primary overflow-hidden">
        <svg
          width="885"
          height="482"
          viewBox="0 0 885 482"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Background */}
          <rect width="885" height="482" fill="#f6f6f6" />

          {/* ── Quadrant labels (Geist Mono 11px) ── */}
          <text x="8"   y="15"  fontFamily="'Geist Mono', monospace" fontSize="11" fill="#171717">Promessa simbolica</text>
          <text x="877" y="15"  fontFamily="'Geist Mono', monospace" fontSize="11" fill="#171717" textAnchor="end">Concept allineato</text>
          <text x="8"   y="474" fontFamily="'Geist Mono', monospace" fontSize="11" fill="#171717">Idea embrionale</text>
          <text x="877" y="474" fontFamily="'Geist Mono', monospace" fontSize="11" fill="#171717" textAnchor="end">In cerca di senso</text>

          {/* ── Centre dividers only — 50 % on each axis, full opacity ── */}
          {/* CFML = 50  (gx[1]=Math.floor(885/2)=442 → container x=278+442=720 = section line) */}
          <line x1={gx[1]} y1="0" x2={gx[1]} y2={CHART_H} stroke="#171717" strokeWidth="0.75" strokeDasharray="4 3" />
          {/* SP   = 50 */}
          <line x1="0" y1={gy[1]} x2={CHART_W} y2={gy[1]} stroke="#171717" strokeWidth="0.75" strokeDasharray="4 3" />

          {/* ── Bubbles (white fill, 1px black stroke) ── */}
          {BUBBLES.map((b, i) => (
            <circle
              key={i}
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill="white"
              stroke="#171717"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      {/* ── X-axis tick labels ──
          bg-bg-primary blocks the vertical dashed lines at x = 720 and
          x = 1161 from showing through the transparent text background
          (e.g. "50" sits at x ≈ 714–728, "100" at x ≈ 1152–1172). */}
      {X_TICKS.map(({ label, left }) => (
        <p
          key={`x-${label}`}
          className="absolute font-mono text-metadata text-fg-primary leading-normal bg-bg-primary"
          style={{ left, top: 866 }}
        >
          {label}
        </p>
      ))}

      {/* ── X-axis label + info icon ── */}
      {/* Figma: centered at x=720, top≈893.
          bg-bg-primary hides the vertical centre dashed line
          that would otherwise show through the label text. */}
      <div
        className="absolute flex items-center gap-[6px] bg-bg-primary px-[4px]"
        style={{ left: "50%", top: 893, transform: "translateX(-50%)" }}
      >
        <p
          className="font-sans text-fg-primary uppercase whitespace-nowrap"
          style={{ fontSize: 20, lineHeight: 1 }}
        >
          <strong>CFML</strong>: MATURITÀ FUNZIONALE
        </p>
        <InfoIcon />
      </div>

      {/* ── Legend (bottom-right of chart) ── */}
      {/* Abs: left≈1192, top=748 */}
      <div
        className="absolute flex flex-col"
        style={{ left: 1192, top: 748, gap: 10 }}
      >
        {LEGEND.map(({ r, label }) => (
          <div
            key={label}
            className="flex items-center"
            style={{ gap: 8, minHeight: r * 2 + 2 }}
          >
            <div className="flex items-center justify-center" style={{ width: 45 }}>
              <svg
                width={r * 2}
                height={r * 2}
                viewBox={`0 0 ${r * 2} ${r * 2}`}
                aria-hidden="true"
              >
                <circle
                  cx={r}
                  cy={r}
                  r={r - 0.5}
                  fill="white"
                  stroke="#171717"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <span className="font-mono text-metadata text-fg-primary leading-normal">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          3 · COME TROVO LA POSIZIONE DI UN CONCEPT?
      ═══════════════════════════════════════════════════════════ */}

      {/* Eyebrow box — 363 × 30 */}
      <div className="absolute left-[219px] top-[1018px] w-[363px] h-[30px] bg-bg-elevated border border-fg-primary flex items-center justify-center">
        <p className="font-sans text-body text-fg-primary uppercase leading-none">
          COME TROVO LA POSIZIONE DI UN CONCEPT?
        </p>
      </div>

      {/* ── 2 × 2 step grid ──
          Left column: left=219, w=502
          Right column: left=720, w=502
          Row 1: top=1056, h=163
          Row 2: top=1218, h=163
          Adjacent edges share a single 1px border via 1px overlap.
      ── */}

      {/* 01 — CARICHI IL CONCEPT */}
      <div className="absolute left-[219px] top-[1056px] w-[502px] h-[163px] bg-bg-elevated border border-fg-primary">
        <p className="absolute left-[27px] top-[50px] font-heading font-bold text-h1 text-fg-primary leading-[60px] uppercase">
          01
        </p>
        <p className="absolute left-[150px] top-[20px] w-[313px] font-sans text-display-caps text-fg-primary leading-[60px] uppercase">
          CARICHI IL CONCEPT
        </p>
        <p className="absolute left-[150px] top-[70px] w-[309px] font-sans text-body text-fg-primary leading-normal">
          Carichi lo stimulus pack: titolo, descrizione, immagini e tutto ciò che
          serve per spiegare la tua idea.
        </p>
      </div>

      {/* 02 — COMPILI LA CFML */}
      <div className="absolute left-[219px] top-[1218px] w-[502px] h-[163px] bg-bg-elevated border border-fg-primary">
        <p className="absolute left-[27px] top-[50px] font-heading font-bold text-h1 text-fg-primary leading-[60px] uppercase">
          02
        </p>
        <p className="absolute left-[150px] top-[20px] w-[313px] font-sans text-display-caps text-fg-primary leading-[60px] uppercase">
          COMPILI LA CFML
        </p>
        <p className="absolute left-[150px] top-[70px] w-[313px] font-sans text-body text-fg-primary leading-normal">
          Rispondi alla checklist di autovalutazione per misurare quanto il tuo
          concept è pronto a livello tecnico.
        </p>
      </div>

      {/* 03 — DISTRIBUISCI LA SP */}
      <div className="absolute left-[720px] top-[1056px] w-[502px] h-[163px] bg-bg-elevated border border-fg-primary">
        <p className="absolute left-[27px] top-[50px] font-heading font-bold text-h1 text-fg-primary leading-[60px] uppercase">
          03
        </p>
        <p className="absolute left-[149px] top-[20px] w-[318px] font-sans text-display-caps text-fg-primary leading-[60px] uppercase">
          DISTRIBUISCI LA SP
        </p>
        <p className="absolute left-[149px] top-[70px] w-[309px] font-sans text-body text-fg-primary leading-normal">
          Genera il sondaggio e condividilo per capire come le persone
          percepirebbero il tuo prodotto.
        </p>
      </div>

      {/* 04 — OTTIENI LA DIAGNOSI */}
      <div className="absolute left-[720px] top-[1218px] w-[502px] h-[163px] bg-bg-elevated border border-fg-primary">
        <p className="absolute left-[26px] top-[50px] font-heading font-bold text-h1 text-fg-primary leading-[60px] uppercase">
          04
        </p>
        <p className="absolute left-[149px] top-[20px] w-[341px] font-sans text-display-caps text-fg-primary leading-[60px] uppercase">
          OTTIENI LA DIAGNOSI
        </p>
        <p className="absolute left-[149px] top-[70px] w-[318px] font-sans text-body text-fg-primary leading-normal">
          Posizione nella matrice, punteggi per dimensione, profilo simbolico e
          direzione futura di lavoro.
        </p>
      </div>

      {/* ── CTA pill ── abs left=1114, top=1389 */}
      <button
        type="button"
        className="absolute h-[30px] px-[8px] flex items-center justify-center gap-[8px] bg-accent-primary border border-fg-primary font-sans text-body text-fg-primary whitespace-nowrap leading-none"
        style={{ left: 1114, top: 1389 }}
      >
        Diagnosi? ↓
      </button>

      </div>{/* end mx-auto frame */}
    </section>
  );
}
