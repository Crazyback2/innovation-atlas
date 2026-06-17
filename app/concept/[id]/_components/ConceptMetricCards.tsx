const ACTION_BUTTON_BASE =
  "flex h-[29px] w-[156px] items-center justify-center border border-fg-primary font-sans text-body leading-normal";

export default function ConceptMetricCards() {
  return (
    <section
      aria-label="Stato CFML e Symbolic Perception"
      className="flex h-[212px] border border-fg-primary bg-bg-elevated"
    >
      <div className="flex flex-1 flex-col px-[35px] py-8">
        <div className="flex items-start justify-between gap-6">
          <h2 className="max-w-[451px] font-sans text-display-caps uppercase leading-[30px] text-fg-primary">
            Concept functional maturity level
          </h2>
          <span
            aria-hidden="true"
            className="shrink-0 font-heading text-h1 font-bold uppercase leading-[60px] text-fg-primary"
          >
            -
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6">
          <div className="font-mono text-metadata leading-normal text-fg-primary">
            <p className="font-bold uppercase">- LIVELLI SU - SUPERATI</p>
            <p className="uppercase">CHECKLIST COMPLETATA -.-.-</p>
          </div>
          <div
            className={`${ACTION_BUTTON_BASE} shrink-0 bg-accent-secondary text-bg-elevated`}
          >
            Inizia CFML
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="w-px shrink-0 self-stretch bg-fg-primary" />

      <div className="flex flex-1 flex-col px-[35px] py-8">
        <div className="flex items-start justify-between gap-6">
          <h2 className="max-w-[334px] font-sans text-display-caps uppercase leading-[30px] text-fg-primary">
            <span className="block">Symbolic</span>
            <span className="block">perception</span>
          </h2>
          <span
            aria-hidden="true"
            className="shrink-0 font-heading text-h1 font-bold uppercase leading-[60px] text-fg-primary"
          >
            -
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6">
          <div className="font-mono text-metadata leading-normal text-fg-primary">
            <p className="font-bold uppercase">- RISPONDENTI · - DIMENSIONI ALTE</p>
            <p className="uppercase">FINESTRA DI RACCOLTA INIZIATA IN -</p>
          </div>
          <div
            className={`${ACTION_BUTTON_BASE} shrink-0 bg-accent-primary text-fg-primary`}
          >
            Crea SP
          </div>
        </div>
      </div>
    </section>
  );
}
