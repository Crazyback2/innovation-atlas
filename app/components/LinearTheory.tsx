export default function LinearTheory() {
  return (
    <section className="relative w-full h-[760px] bg-bg-primary overflow-hidden">

      {/* ── Top separator ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-fg-primary" />

      {/* ── Timeline SVG — wrapper div guarantees left/right width constraint ── */}
      {/* All elements shifted up 41px to achieve 96px bottom clearance */}
      {/* SVG: top=195 (was 236) · section label: top=442 · boxes: top=461 · CTAs: top=635 */}
      <div className="absolute left-[96px] right-[96px] top-[195px] h-[214px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/theory.svg"
          alt=""
          aria-hidden="true"
          className="w-full h-full"
        />
      </div>

      {/* ── Section label — Geist Mono Regular 11px ── */}
      <p className="absolute left-[96px] top-[442px] font-mono text-metadata text-fg-primary leading-normal">
        {`01 // THEORY by P.FLICHY`}
      </p>

      {/* ── Left content box — left=96, right=980 ── */}
      {/* right=96+885−1=980: right edge 1px past right box's left border → shared single border */}
      <div className="absolute left-[96px] right-[980px] top-[461px] h-[166px] bg-bg-elevated border border-fg-primary">

        {/* Body copy — Space Grotesk Regular 15px, vertically centered */}
        <p className="absolute left-[41px] right-[41px] top-1/2 -translate-y-1/2 font-sans text-body text-fg-primary leading-normal">
          Il modello classico descrive l&rsquo;innovazione come una sequenza
          lineare che va da A a B: dall&rsquo;invenzione al prodotto, attraverso
          fasi progressive e ordinate.<br />Un autore, un&rsquo;idea, un risultato.
        </p>

      </div>

      {/* ── Right content box — right=96, w=885 ── */}
      <div className="absolute right-[96px] top-[461px] w-[885px] h-[166px] bg-bg-elevated border border-fg-primary">

        {/* Circle "i" — 22px, border accent-secondary */}
        <div className="absolute left-[63px] top-[26px] w-[22px] h-[22px] rounded-full bg-bg-elevated border border-accent-secondary flex items-center justify-center">
          <span className="font-mono text-[12px] text-accent-secondary leading-none">i</span>
        </div>

        {/* "ma" — Space Grotesk Medium 30px */}
        <p className="absolute left-[39px] top-[66px] -translate-y-1/2 font-sans font-medium text-display text-fg-primary leading-none">
          ma
        </p>

        {/* Main title — Geist Bold 70px / 60px leading, right-aligned */}
        <p className="absolute left-[10px] right-[26px] top-[21px] font-heading font-bold text-h1 text-fg-primary leading-[60px] uppercase text-right">
          L&rsquo;INNOVAZIONE NON É<br />UN PROCESSO LINEARE
        </p>

      </div>

      {/* ── CTA: Scorri in basso ── */}
      {/* top=635: box bottom 461+166=627 + 8px gap = 635 */}
      {/* bottom=635+29=664: section 760 − 664 = 96px ✓ */}
      {/* bianco → viola */}
      <button
        type="button"
        className="absolute left-[96px] top-[635px] w-[156px] h-[29px] flex items-center justify-center gap-2 bg-bg-elevated border border-fg-primary font-sans text-body text-fg-primary whitespace-nowrap leading-none cursor-pointer transition-colors duration-150 ease-out hover:bg-accent-secondary hover:text-bg-elevated focus-visible:bg-accent-secondary focus-visible:text-bg-elevated focus-visible:outline-none"
      >
        ↓ Scorri in basso
      </button>

      {/* ── CTA: Scopri perchè — lime → nero */}
      <button
        type="button"
        className="absolute right-[96px] top-[635px] w-[155px] h-[29px] flex items-center justify-center gap-2 bg-accent-primary border border-fg-primary font-sans text-body text-fg-primary whitespace-nowrap leading-none cursor-pointer transition-colors duration-150 ease-out hover:bg-fg-primary hover:text-bg-elevated focus-visible:bg-fg-primary focus-visible:text-bg-elevated focus-visible:outline-none"
      >
        Scopri perchè →
      </button>

    </section>
  );
}
