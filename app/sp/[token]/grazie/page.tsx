import Link from "next/link";
import {
  respondentContainerClassName,
  respondentPageClassName,
} from "@/app/concept/wizard-container";

export default async function SPGraziePage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <main
        className={`${respondentPageClassName} flex-1 justify-center py-[var(--spacing-section)]`}
      >
        <div className={`${respondentContainerClassName} flex flex-col gap-8`}>
          <div className="flex items-start justify-between gap-6">
            <p className="font-mono text-metadata leading-normal text-fg-primary">
              Innovation Atlas // V.01
            </p>
            <p className="font-mono text-metadata leading-normal text-fg-primary text-right">
              // Politecnico di Milano
            </p>
          </div>

          <h1 className="font-heading text-hero font-bold uppercase leading-[80px] text-fg-primary">
            Grazie
          </h1>

          <p className="font-sans text-body leading-normal text-fg-primary">
            La tua risposta è stata registrata. Confluisce nel profilo
            percettivo di questo concept insieme a quelle degli altri
            rispondenti: è l&apos;insieme delle risposte, non la singola, a
            rendere leggibile come il concept viene percepito.
          </p>

          <div
            className="w-full border-t border-dashed border-fg-primary"
            aria-hidden="true"
          />

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="cursor-pointer border-none bg-accent-secondary px-6 py-3.5 font-sans text-body font-medium leading-normal text-bg-elevated transition-opacity duration-150 ease-out hover:opacity-90"
            >
              Innovation Atlas
            </Link>
            <p className="font-sans text-body leading-normal text-fg-primary">
              Scopri il progetto e l&apos;archivio dei concept.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
