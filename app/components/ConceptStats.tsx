"use client";

import { useState, type ReactNode } from "react";
import type { Concept } from "@/src/data/concepts";
import { formatDate, formatRange } from "@/src/lib/format";
import CFMLBreakdown from "@/app/components/CFMLBreakdown";
import SPBreakdown from "@/app/components/SPBreakdown";

interface Props {
  concept: Concept;
  /** Se true, i pannelli partono aperti. Default: false (archivio). */
  defaultOpen?: boolean;
  /** Slot opzionale in fondo al pannello CFML (es. download CSV). */
  cfmlDownload?: ReactNode;
  /** Slot opzionale in fondo al pannello SP (es. download CSV). */
  spDownload?: ReactNode;
  /**
   * Se false, pannello CFML in stato disattivato (hub privata in bozza).
   * Default true: comportamento attuale di /archivio.
   */
  cfmlAvailable?: boolean;
  /**
   * Se false, pannello SP in stato disattivato (hub privata in bozza).
   * Default true: comportamento attuale di /archivio.
   */
  spAvailable?: boolean;
}

const EXPAND_BTN =
  "flex h-[29px] shrink-0 items-center gap-[10px] border border-fg-primary bg-bg-elevated px-[12px] pt-[8px] pb-[7px] font-mono text-metadata text-fg-primary leading-none transition-colors duration-150 ease-out hover:bg-accent-primary";

/** Chrome riquadro attivo — invariato rispetto a /archivio. */
const BOX_ACTIVE = "border border-fg-primary bg-bg-elevated";
/**
 * Chrome riquadro disattivato: bordo attenuato, stesso sfondo elevated,
 * senza opacity sul bordo (l'opacity va solo sul contenuto).
 */
const BOX_DISABLED = "border border-border-muted bg-bg-elevated";

function StatColumn({
  title,
  score,
  metadata,
  expandable,
  isOpen,
  onToggle,
  panel,
  available,
}: {
  title: ReactNode;
  score: ReactNode;
  metadata: ReactNode;
  expandable: boolean;
  isOpen: boolean;
  onToggle: () => void;
  panel?: ReactNode;
  available: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col" aria-disabled={!available}>
      <div
        className={`flex min-h-[212px] flex-col px-[35px] py-[32px] ${
          available ? "" : "opacity-40"
        }`}
      >
        <div className="flex items-start justify-between gap-[16px]">
          <div className="font-sans text-display-caps uppercase leading-[30px] text-fg-primary">
            {title}
          </div>
          <p className="shrink-0 font-heading text-h1 font-bold leading-[60px] text-fg-primary">
            {score}
          </p>
        </div>

        <div className="mt-[18px] h-[29px]" aria-hidden="true" />

        <div className="mt-auto flex items-end justify-between gap-[16px]">
          <div className="font-mono text-metadata leading-normal text-fg-primary">
            {metadata}
          </div>
          {expandable && (
            <button
              type="button"
              className={EXPAND_BTN}
              aria-expanded={isOpen}
              onClick={onToggle}
            >
              {isOpen ? "Riduci ↑" : "Espandi ↓"}
            </button>
          )}
        </div>
      </div>

      {isOpen && panel && (
        <div className="min-w-0 border-t border-fg-primary p-8">{panel}</div>
      )}
    </div>
  );
}

export default function ConceptStats({
  concept,
  defaultOpen = false,
  cfmlDownload,
  spDownload,
  cfmlAvailable = true,
  spAvailable = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => setOpen((prev) => !prev);

  const cfmlDetail = concept.cfmlDetail;
  const spDimensions = concept.spDimensions;
  const cfmlExpandable = cfmlAvailable && Boolean(cfmlDetail);
  const spExpandable = spAvailable && Boolean(spDimensions);
  // Entrambi i pannelli spenti → stesso chrome del riquadro matrice disattivato.
  const boxDisabled = !cfmlAvailable && !spAvailable;

  return (
    <div
      className={`relative mt-[91px] w-[1160px] ${
        boxDisabled ? BOX_DISABLED : BOX_ACTIVE
      }`}
    >
      <div className="flex items-start">
        <StatColumn
          title={
            <>
              Concept functional
              <br />
              maturity level
            </>
          }
          score={cfmlAvailable ? concept.cfml : "—"}
          available={cfmlAvailable}
          expandable={cfmlExpandable}
          isOpen={open}
          onToggle={toggle}
          metadata={
            cfmlAvailable ? (
              <>
                <p className="font-bold uppercase">
                  {concept.cfmlLevelsPassed ?? "—"} LIVELLI SU 6 SUPERATI
                </p>
                <p className="uppercase">
                  CHECKLIST COMPLETATA {formatDate(concept.cfmlCompletedAt)}
                </p>
              </>
            ) : (
              <>
                <p className="font-bold uppercase">Da compilare</p>
                <p className="uppercase">Checklist non ancora completata</p>
              </>
            )
          }
          panel={
            cfmlExpandable && cfmlDetail ? (
              <div className="flex flex-col gap-8">
                <CFMLBreakdown
                  perLevelScores={cfmlDetail.perLevelScores}
                  levelConsolidation={cfmlDetail.levelConsolidation}
                  answers={cfmlDetail.answers}
                />
                {cfmlDownload ?? null}
              </div>
            ) : null
          }
        />

        <StatColumn
          title={
            <span className="block pl-[8px]">
              Symbolic
              <br />
              perception
            </span>
          }
          score={spAvailable ? concept.sp : "—"}
          available={spAvailable}
          expandable={spExpandable}
          isOpen={open}
          onToggle={toggle}
          metadata={
            spAvailable ? (
              <>
                <p className="font-bold uppercase">
                  {concept.spResponses} RISPONDENTI
                </p>
                <p className="uppercase">
                  FINESTRA DI RACCOLTA{" "}
                  {formatRange(concept.spWindowStart, concept.spWindowEnd)}
                </p>
              </>
            ) : (
              <>
                <p className="font-bold uppercase">In attesa di risposte</p>
                <p className="uppercase">Nessuna rilevazione SP disponibile</p>
              </>
            )
          }
          panel={
            spExpandable && spDimensions ? (
              <div className="flex flex-col gap-8">
                <SPBreakdown
                  perDimension={spDimensions}
                  responseCount={concept.spResponses}
                  minResponses={0}
                />
                {spDownload ?? null}
              </div>
            ) : null
          }
        />
      </div>

      <div
        className={`pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 ${
          boxDisabled ? "bg-border-muted" : "bg-fg-primary"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
