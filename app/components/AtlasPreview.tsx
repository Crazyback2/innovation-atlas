import { concepts, isPlaceholderConcept, type Concept } from "@/src/data/concepts";
import { ArchiveConceptCard, CONCEPT_CARD_GRID_W } from "@/app/components/CardGrid";
import { loadRealConceptImages } from "@/src/lib/archivio-source";

// Ticker derivato dai dati reali (stessa fonte di /archivio):
// conteggio concept = lunghezza dell'array, settori = valori distinti del campo
// sector. "2 ASSI DIAGNOSTICI" è fisso (CFML × SP).
const CONCEPT_COUNT = concepts.length;
const SECTOR_COUNT = new Set(concepts.map((c) => c.sector)).size;

const MARQUEE_UNIT = `INNOVATION ATLAS: ${CONCEPT_COUNT} CONCEPT MAPPATI   //   ${SECTOR_COUNT} SETTORI   //   2 ASSI DIAGNOSTICI.   —   `;
const MARQUEE_HALF = MARQUEE_UNIT.repeat(4);

// Larghezza gruppo card: 4 × 248 px + 3 × 24 px gap = 1 064 px (riusata dall'archivio)
const GRID_W = CONCEPT_CARD_GRID_W; // 1064

// Selezione preview: prima i tre concept reali (ordine cubit → shu → hapto),
// poi i primi cinque dimostrativi in ordine d'array. L'array sorgente non viene
// riordinato: la selezione avviene qui.
const REAL_PREVIEW_ORDER = ["cubit", "shu", "hapto"] as const;

const realPreview: Concept[] = REAL_PREVIEW_ORDER.map(
  (id) => concepts.find((c) => c.id === id),
).filter((c): c is Concept => Boolean(c));

const demoPreview: Concept[] = concepts.filter(isPlaceholderConcept).slice(0, 5);

const PREVIEW_CONCEPTS: Concept[] = [...realPreview, ...demoPreview];

export default async function AtlasPreview() {
  // Come nella griglia /archivio: le hero image reali dei 3 concept pubblici
  // arrivano dal DB; i dimostrativi usano le immagini definite in concepts.ts.
  const realImages = await loadRealConceptImages();
  const previewConcepts = PREVIEW_CONCEPTS.map((c) =>
    realImages[c.id] ? { ...c, images: realImages[c.id] } : c,
  );

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
        <div className="relative mx-auto w-[1440px]" style={{ height: 113 }}>
          <p className="absolute left-[96px] top-[94px] font-mono text-metadata text-fg-primary leading-normal bg-bg-primary pr-[4px]">
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
              {previewConcepts.map((concept) => (
                <ArchiveConceptCard
                  key={concept.id}
                  detailBase="archivio"
                  concept={{
                    id: concept.id,
                    title: concept.title,
                    author: concept.author,
                    images: concept.images,
                    sp: concept.sp,
                    cfml: concept.cfml,
                  }}
                />
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
