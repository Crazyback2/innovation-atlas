export default function AtlasCta() {
  return (
    <section className="w-full bg-bg-primary relative isolate overflow-hidden">

      {/* Linee tratteggiate verticali */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1440px] pointer-events-none z-[0]">
        <div
          className="absolute inset-y-0 border-r border-dashed border-fg-primary"
          style={{ left: 278 }}
        />
        <div
          className="absolute inset-y-0 border-l border-dashed border-fg-primary"
          style={{ left: 1162 }}
        />
      </div>

      {/* Contenuto — z-1, sopra il PNG */}
      <div className="relative z-[1] mx-auto w-[1440px] flex flex-col items-center pt-[96px] pb-[160px]">

        {/* Box CTA — SVG superiore + box inferiore */}
        <div className="w-[711px]">

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Box_over_CTA.svg"
            alt="Mappa il tuo concept"
            width={711}
            height={182}
            className="block"
          />

          <div className="h-[64px] border border-fg-primary border-t-0 bg-bg-elevated flex items-center pl-[35px] pr-[40px]">
            <p className="font-sans text-lead text-fg-primary leading-normal flex-1">
              Ogni innovazione ha la sua geografia. Misuriamo la tua.
            </p>
            <div className="flex items-center h-[11px]">
              <div className="w-[30px] h-full bg-accent-tertiary" />
              <div className="w-[45px] h-full bg-accent-primary -ml-[8px]" />
              <div className="w-[16px] h-full bg-accent-secondary" />
              <div className="w-[14px] h-full bg-fg-primary" />
            </div>
          </div>

        </div>

        {/* Bottone — 8 px sotto il box CTA */}
        <div className="mt-[8px]">
          {/* forte: viola → bianco */}
          <button
            type="button"
            className="h-[30px] px-[12px] flex items-center gap-[6px]
                       bg-accent-secondary border border-fg-primary
                       font-sans text-body text-bg-elevated whitespace-nowrap leading-none
                       cursor-pointer transition-colors duration-150 ease-out
                       hover:bg-fg-primary hover:text-bg-elevated
                       focus-visible:bg-fg-primary focus-visible:text-bg-elevated focus-visible:outline-none"
          >
            Analizza concept ↗
          </button>
        </div>

      </div>
    </section>
  );
}
