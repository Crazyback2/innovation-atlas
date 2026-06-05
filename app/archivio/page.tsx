import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ArchivioClient from "@/app/components/ArchivioClient";
import { concepts } from "@/src/data/concepts";

const totalConcepts = concepts.length;
const totalSectors = new Set(concepts.map((c) => c.sector)).size;
const totalSpResponses = concepts.reduce((sum, c) => sum + c.spResponses, 0);

function padStat(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export const metadata = {
  title: "Archivio — Innovation Atlas",
  description: "Archivio di concept di prodotti futuri analizzati da Innovation Atlas.",
};

export default function ArchivioPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-sans">
      <Header />

      <main className="flex-1">
        {/* ══════════════════════════════════════════
            FASCIA 1 + 2: meta line · titolo · stats
            ══════════════════════════════════════════ */}
        <section className="relative w-full bg-bg-primary overflow-hidden">

          {/* ── Meta line — 8 px below header, same as landing ── */}
          <p className="absolute left-[32px] top-2 font-mono text-metadata text-fg-primary leading-normal whitespace-nowrap">
            Innovation Atlas // V.01 // 2026
          </p>
          <p className="absolute right-[32px] top-2 font-mono text-metadata text-fg-primary leading-normal text-right whitespace-nowrap">
            Research prototype // Politecnico di Milano
          </p>

          {/* ── Contenuto principale — centrato, larghezza 893 px come nel Figma ── */}
          <div className="flex flex-col items-center pt-[79px] pb-[0] gap-[32px]">

            {/* ── Blocco titolo ATLAS ── centrato come gruppo */}
            {/*
              Il gruppo è trattato come unità e centrato orizzontalmente dal
              flex-col items-center del parent. items-start interno garantisce
              che le due righe abbiano lo stesso bordo sinistro → A di ATLAS
              e A di ARCHIVIO verticalmente allineate.
              Gap di 16 px fisso tra fine glifo ATLAS e inizio barra cromatica.
            */}
            <div className="flex flex-col items-start">

              {/* Riga 1: ATLAS + 16 px gap + barra cromatica */}
              <div className="flex items-center">

                {/* Parola ATLAS — display/hero */}
                <h1
                  className="shrink-0 font-heading font-bold text-hero leading-[80px] text-fg-primary whitespace-nowrap"
                  aria-label="Atlas — Archivio di concept di prodotti futuri"
                >
                  ATLAS
                </h1>

                {/* Gap 20 px tra fine parola e inizio barra */}
                <div className="w-[20px] shrink-0" aria-hidden="true" />

                {/* Barra cromatica — 4 segmenti, centrata verticalmente nella riga */}
                <div className="flex self-center" aria-hidden="true">
                  <div className="h-[21px] w-[147px] bg-accent-tertiary" />
                  <div className="h-[21px] w-[83px] bg-accent-primary" />
                  <div className="h-[21px] w-[35px] bg-accent-secondary" />
                  <div className="h-[21px] w-[21px] bg-fg-primary" />
                </div>

              </div>

              {/* Riga 2: sottotitolo — stesso bordo sinistro di ATLAS */}
              <p className="mt-[-10px] font-sans text-display-caps uppercase leading-[60px] text-fg-primary whitespace-nowrap">
                ARCHIVIO DI CONCEPT DI PRODOTTI FUTURI.
              </p>

            </div>

            {/* ── Riga 3 stats — display/h1 per i numeri, body/caps per le label ── */}
            {/*
              Dal Figma (node 410:43523): gap-[194px] tra le 3 colonne.
              Ogni colonna: flex-col, items-center, gap-[8px].
              Numeri < 10 → 2 cifre con zero (es. "08").
              Numeri grandi → nessun padding.
            */}
            <div className="flex items-start gap-[194px]">

              <div className="flex flex-col items-center gap-[8px]">
                <p className="font-heading font-bold text-h1 leading-[60px] text-fg-primary">
                  {padStat(totalConcepts)}
                </p>
                <p className="font-sans text-body uppercase text-fg-primary whitespace-nowrap">
                  CONCEPT ANALIZZATI
                </p>
              </div>

              <div className="flex flex-col items-center gap-[8px]">
                <p className="font-heading font-bold text-h1 leading-[60px] text-fg-primary">
                  {padStat(totalSectors)}
                </p>
                <p className="font-sans text-body uppercase text-fg-primary whitespace-nowrap">
                  SETTORI TRATTATI
                </p>
              </div>

              <div className="flex flex-col items-center gap-[8px]">
                <p className="font-heading font-bold text-h1 leading-[60px] text-fg-primary">
                  {padStat(totalSpResponses)}
                </p>
                <p className="font-sans text-body uppercase text-fg-primary whitespace-nowrap">
                  RISPOSTE SP RACCOLTE
                </p>
              </div>

            </div>
          </div>
        </section>

        <ArchivioClient concepts={concepts} />
      </main>

      <Footer />
    </div>
  );
}
