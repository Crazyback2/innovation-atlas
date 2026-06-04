const MARQUEE_UNIT =
  "INNOVATION ATLAS: ATTIVO   //   47 CONCEPT VALUTATI   //   12 SETTORI COPERTI.   —   ";
const MARQUEE_HALF = MARQUEE_UNIT.repeat(4);

// Larghezza gruppo card: 4 × 248 px + 3 × 24 px gap = 1 064 px
const GRID_W = 4 * 248 + 3 * 24; // 1064

type ConceptCardData = {
  project: string;
  author: string;
  sp: number;
  cfml: number;
};

const CARDS: ConceptCardData[] = [
  { project: "Grogolix",       author: "Gabriele Beltrami", sp: 76,  cfml: 34  },
  { project: "Red Bull Dakar", author: "Lorenzo Romano",    sp: 83,  cfml: 20  },
  { project: "HZ.008",         author: "Heimplanet",        sp: 66,  cfml: 100 },
  { project: "Wh.E3",          author: "Joshua O'Connor",   sp: 50,  cfml: 71  },
  { project: "MK.Velox",       author: "Marta Kauffmann",   sp: 72,  cfml: 45  },
  { project: "Solara IX",      author: "Takeshi Mori",      sp: 58,  cfml: 88  },
  { project: "Ark.Zero",       author: "Elisa Ferretti",    sp: 91,  cfml: 30  },
  { project: "NWD-7",          author: "Chloe Bernard",     sp: 44,  cfml: 62  },
];

function ConceptCard({ project, author, sp, cfml }: ConceptCardData) {
  return (
    // Container: group per coordinare il double-transform; w/shrink risiedono qui
    // L'hover si attiva sull'intera area del container (mouse-enter)
    <div className="relative group cursor-pointer w-[248px] shrink-0">

      {/* Piastra nera — stessa footprint della card via absolute inset-0.
          Default: translate(0,0) — coincide con la card, non visibile.
          Hover:   translate(+1px, +1px). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-fg-primary transition-transform duration-300 ease-out group-hover:translate-x-[1px] group-hover:translate-y-[1px]"
      />

      {/* Card — sopra la piastra (relative crea stacking context).
          Default: translate(0,0).
          Hover:   translate(-2px, -2px) → gap visivo totale 3px. */}
      <div className="relative border border-fg-primary bg-bg-elevated transition-transform duration-300 ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]">
        <div className="h-[180px] bg-accent-tertiary" />
        <div className="h-[68px] border-t border-fg-primary px-[13px] py-[9px] flex gap-x-[6px]">
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="font-mono text-metadata text-fg-primary leading-normal truncate">
              Project: {project}
            </span>
            <span className="font-mono text-metadata text-fg-primary leading-normal">
              Author:
            </span>
            <span className="font-mono text-metadata text-fg-primary leading-normal truncate">
              {author}
            </span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="font-mono font-bold text-metadata text-fg-primary leading-normal select-none">
              &nbsp;
            </span>
            <span className="font-mono font-bold text-metadata text-fg-primary leading-normal whitespace-nowrap">
              {sp} SP
            </span>
            <span className="font-mono font-bold text-metadata text-fg-primary leading-normal whitespace-nowrap">
              {cfml} CFML
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function AtlasPreview() {
  return (
    /*
      Ghost container: `absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1440px]`
      è matematicamente equivalente a `mx-auto w-[1440px]` per la centratura
      orizzontale su qualsiasi larghezza di viewport:
        (viewport/2) − (1440/2) = (viewport − 1440) / 2  ← stessa formula di mx-auto
      Le righe tratteggiate al suo interno si allineano pixel-perfect con quelle
      di Matrix a tutti i viewport, non solo a 1440 px esatti.
    */
    <section className="w-full bg-bg-primary relative isolate">

      {/* ── Ghost container — solo riferimento di posizionamento per le righe ── */}
      {/*    Stessa centratura del container mx-auto w-[1440px] di Matrix.          */}
      {/*    pointer-events-none: i click passano al contenuto sottostante.         */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1440px] -translate-x-1/2 pointer-events-none">
        <div
          className="absolute inset-y-0 border-r border-dashed border-fg-primary"
          style={{ left: 278 }}
        />
        <div
          className="absolute inset-y-0 border-l border-dashed border-fg-primary"
          style={{ left: 1162 }}
        />
      </div>

      {/* ── Contenuto — z-[1], sempre sopra le righe ── */}
      <div className="relative z-[1]">

        {/* Bordo superiore full-width — tratteggiato */}
        <div className="w-full border-t border-dashed border-fg-primary" />

        {/* Area eyebrow: altezza 83 px = distanza top-sezione → bordo-top marquee in Figma.
            L'eyebrow è absolute al suo interno; bg-bg-primary copre la riga tratteggiata. */}
        <div className="relative mx-auto w-[1440px]" style={{ height: 83 }}>
          <p className="absolute left-[96px] top-[64px] font-mono text-metadata text-fg-primary leading-normal bg-bg-primary pr-[4px]">
            03 // ATLAS
          </p>
        </div>

        {/* Marquee full-width (w-full, non confinato al frame 1440 px).
            bg-bg-primary copre le righe tratteggiate nella banda.
            Accessibilità: il testo è informativo (conta i concept valutati) quindi
            viene esposto agli screen reader UNA volta sola tramite sr-only; il track
            animato è interamente aria-hidden per evitare che le 8 ripetizioni vengano
            lette. Con prefers-reduced-motion:reduce l'animazione si ferma (via CSS). */}
        <div className="w-full h-[85px] border-t border-b border-fg-primary bg-bg-primary overflow-hidden flex items-center">

          {/* Testo accessibile — una sola occorrenza, invisibile visivamente */}
          <p className="sr-only">{MARQUEE_UNIT.trimEnd()}</p>

          {/* Track animato — aria-hidden: nascosto agli screen reader perché
              duplicato più volte; il contenuto reale è nel sr-only sopra. */}
          <div
            aria-hidden="true"
            className="flex whitespace-nowrap motion-safe:animate-marquee"
            style={{ willChange: "transform" }}
          >
            <span className="font-sans text-display-caps text-fg-primary uppercase">
              {MARQUEE_HALF}
            </span>
            <span className="font-sans text-display-caps text-fg-primary uppercase">
              {MARQUEE_HALF}
            </span>
          </div>

        </div>

        {/* Card grid + bottone — dentro il frame 1440 px */}
        <div className="mx-auto w-[1440px]">
          <div className="pt-[120px] pb-0 flex flex-col items-center">

            <div className="grid grid-cols-4 gap-[24px]" style={{ width: GRID_W }}>
              {CARDS.map((card) => (
                <ConceptCard key={card.project} {...card} />
              ))}
            </div>

            {/* Bottone allineato al bordo sinistro del gruppo card, 8 px sotto */}
            <div className="mt-[8px]" style={{ width: GRID_W }}>
              {/* debole: bianco → viola */}
              <button
                type="button"
                className="h-[30px] px-[8px] flex items-center gap-[6px] bg-bg-elevated border border-fg-primary font-sans text-body text-fg-primary whitespace-nowrap leading-none cursor-pointer transition-colors duration-150 ease-out hover:bg-accent-secondary hover:text-bg-elevated focus-visible:bg-accent-secondary focus-visible:text-bg-elevated focus-visible:outline-none"
              >
                Esplora archivio ↗
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
