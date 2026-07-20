import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[867px] bg-bg-primary overflow-hidden">

      {/* ── Background SVG — full-hero, behind all content ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/background-landing.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ── Metadata labels — 8px below Header ── */}
      {/* Geist Mono Regular 11px */}
      <p className="absolute left-[32px] top-2 font-mono text-metadata text-fg-primary leading-normal whitespace-nowrap">
        Innovation Atlas // V.01 // 2026
      </p>
      <p className="absolute right-[33px] top-2 font-mono text-metadata text-fg-primary leading-normal text-right whitespace-nowrap">
        Research prototype // Politecnico di Milano
      </p>

      {/* ── Section label — Geist Mono Regular 11px ── */}
      <p className="absolute left-[96px] top-[346px] font-mono text-metadata text-fg-primary leading-normal">
        00 // MANIFESTO
      </p>

      {/* ── Title box — 706×224px total (border included) ── */}
      {/* left=96 · w=706 · right edge=802px */}
      <div className="absolute left-[96px] top-[368px] w-[706px] h-[224px] bg-bg-elevated border border-fg-primary">
        <h1 className="absolute left-8 top-8 right-8 font-heading font-bold text-hero text-fg-primary leading-[80px]">
          MAPPARE<br />L&rsquo;ASINCRONIA
        </h1>
      </div>

      {/* ── Description box — 706×142px total (border included) ── */}
      {/* top=591 → 1px shared border with title bottom (368+224=592) */}
      {/* left=96 · w=706 · right edge=802px — same as title box */}
      {/* flex items-center: vertically centers bar + text as a unit */}
      {/* pl-[45px]: bar offset from Figma · gap-[37px]: bar-to-text gap from Figma */}
      <div className="absolute left-[96px] top-[591px] w-[706px] h-[142px] bg-bg-elevated border border-fg-primary flex items-center pl-[45px] gap-[37px]">

        {/* Color bar — 15px wide, 66px tall (36+15+8+7) */}
        <div className="flex flex-col w-[15px] shrink-0">
          <div className="bg-fg-primary h-[36px] w-full shrink-0" />
          <div className="bg-accent-secondary h-[15px] w-full shrink-0" />
          <div className="bg-accent-primary h-[8px] w-full shrink-0" />
          <div className="bg-accent-tertiary h-[7px] w-full shrink-0" />
        </div>

        {/* Description text — Space Grotesk Regular 20px / leading 26px */}
        <p className="font-sans font-normal text-lead text-fg-primary leading-[26px] w-[541px]">
          Innovation Atlas è uno strumento di ricerca per valutare<br />
          concept di prodotti futuri lungo due assi:<br />
          Maturità funzionale e Percezione simbolica.
        </p>

      </div>

      {/* ── CTA row — description bottom=733 (591+142), +8px gap → top=741 ── */}

      {/* Left pair with 8px gap */}
      <div className="absolute left-[96px] top-[741px] flex gap-2">
        {/* debole: bianco → viola */}
        <Link
          href="/archivio"
          className="flex h-[30px] items-center justify-center gap-[6px] px-2 bg-bg-elevated border border-fg-primary font-sans text-body text-fg-primary whitespace-nowrap leading-none cursor-pointer transition-colors duration-150 ease-out hover:bg-accent-secondary hover:text-bg-elevated focus-visible:bg-accent-secondary focus-visible:text-bg-elevated focus-visible:outline-none"
        >
          Esplora archivio ↗
        </Link>
        {/* debole: bianco → viola */}
        <Link
          href="/analizza"
          className="flex h-[30px] items-center justify-center gap-[6px] px-2 bg-bg-elevated border border-fg-primary font-sans text-body text-fg-primary whitespace-nowrap leading-none cursor-pointer transition-colors duration-150 ease-out hover:bg-accent-secondary hover:text-bg-elevated focus-visible:bg-accent-secondary focus-visible:text-bg-elevated focus-visible:outline-none"
        >
          Analizza concept ↗
        </Link>
      </div>

      {/* Scorri in basso — bianco → viola */}
      <button
        type="button"
        className="absolute left-[657px] top-[741px] flex h-[30px] w-[145px] items-center justify-center gap-2 px-2 bg-bg-elevated border border-fg-primary font-sans text-body text-fg-primary whitespace-nowrap leading-none cursor-pointer transition-colors duration-150 ease-out hover:bg-accent-secondary hover:text-bg-elevated focus-visible:bg-accent-secondary focus-visible:text-bg-elevated focus-visible:outline-none"
      >
        Scorri in basso ↓
      </button>

      {/* ── Icon square — 54×54px, right=96, bottom=96 ── */}
      {/* White square with 1px black border. Dimensione/posizione/bordo invariati:
          il globe è centrato con un margine interno che gli lascia respiro. */}
      <div
        className="absolute right-[96px] bottom-[96px] w-[54px] h-[54px] bg-bg-elevated border border-fg-primary flex items-center justify-center"
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/globe1.svg"
          alt=""
          className="block"
          style={{ width: 32, height: 32 }}
        />
      </div>

    </section>
  );
}
