import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import type { SPConfig, SPItem, SPMethod } from "@/src/data/sp-config/types";
import { submitSPResponse } from "./actions";

type PageProps = {
  params: Promise<{ token: string }>;
};

function ScaleRadios({
  itemId,
  scaleMin,
  scaleMax,
}: {
  itemId: string;
  scaleMin: number;
  scaleMax: number;
}) {
  const values = Array.from(
    { length: scaleMax - scaleMin + 1 },
    (_, i) => scaleMin + i
  );

  return (
    <div className="flex items-center justify-center gap-3">
      {values.map((value) => (
        <label key={value} className="flex flex-col items-center gap-1">
          <input
            type="radio"
            name={itemId}
            value={value}
            required
            className="h-4 w-4 accent-fg-primary"
          />
          <span className="font-mono text-metadata text-fg-primary opacity-70">
            {value}
          </span>
        </label>
      ))}
    </div>
  );
}

function SemanticDifferentialItem({
  item,
  scaleMin,
  scaleMax,
}: {
  item: SPItem;
  scaleMin: number;
  scaleMax: number;
}) {
  return (
    <div
      className="mt-8"
      title={item.tooltip}
    >
      <div className="flex items-center gap-6">
        <span className="w-[120px] shrink-0 text-right font-sans text-body leading-normal text-fg-primary">
          {item.poleLow}
        </span>
        <div className="min-w-0 flex-1">
          <ScaleRadios
            itemId={item.id}
            scaleMin={scaleMin}
            scaleMax={scaleMax}
          />
        </div>
        <span className="w-[120px] shrink-0 font-sans text-body leading-normal text-fg-primary">
          {item.poleHigh}
        </span>
      </div>
    </div>
  );
}

function LikertItem({
  item,
  scaleMin,
  scaleMax,
}: {
  item: SPItem;
  scaleMin: number;
  scaleMax: number;
}) {
  return (
    <div className="mt-8">
      <p className="font-sans text-body leading-relaxed text-fg-primary">
        {item.statement}
      </p>
      <div className="mt-4">
        <ScaleRadios itemId={item.id} scaleMin={scaleMin} scaleMax={scaleMax} />
      </div>
      <div className="mt-2 flex justify-between font-mono text-metadata uppercase text-fg-primary opacity-70">
        <span>1 — Per niente d&apos;accordo</span>
        <span>7 — Completamente d&apos;accordo</span>
      </div>
      {item.openTextField && (
        <div className="mt-4">
          <label
            htmlFor="R5_open"
            className="block font-sans text-body leading-normal text-fg-primary"
          >
            {item.openTextField.label}
          </label>
          <textarea
            id="R5_open"
            name="R5_open"
            rows={3}
            placeholder={item.openTextField.placeholder}
            className="mt-2 w-full resize-y border border-accent-tertiary bg-bg-elevated px-4 py-3 font-sans text-body leading-normal text-fg-primary outline-none placeholder:text-fg-primary placeholder:opacity-50"
          />
        </div>
      )}
    </div>
  );
}

function SurveyItem({
  item,
  method,
  scaleMin,
  scaleMax,
}: {
  item: SPItem;
  method: SPMethod;
  scaleMin: number;
  scaleMax: number;
}) {
  if (method === "semantic_differential") {
    return (
      <SemanticDifferentialItem
        item={item}
        scaleMin={scaleMin}
        scaleMax={scaleMax}
      />
    );
  }

  return (
    <LikertItem item={item} scaleMin={scaleMin} scaleMax={scaleMax} />
  );
}

export default async function SPSurveyPage({ params }: PageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const { data: survey, error } = await supabase
    .from("sp_surveys")
    .select("*")
    .eq("public_token", token)
    .maybeSingle();

  if (error || !survey) {
    notFound();
  }

  const config = survey.config_snapshot as SPConfig;

  return (
    <div className="min-h-screen bg-bg-primary py-16 font-sans">
      <main className="mx-auto w-full max-w-[720px] px-6">
        <header>
          <h1 className="font-heading text-display font-medium leading-normal text-fg-primary">
            Valuta il concept
          </h1>
          <p className="mt-2 font-sans text-body leading-relaxed text-fg-primary opacity-70">
            Rispondi alle domande seguenti in base alla tua prima impressione del
            concept.
          </p>
        </header>

        <section className="mt-8 border border-accent-tertiary bg-bg-elevated px-6 py-5">
          <p className="font-mono text-metadata uppercase tracking-wide text-fg-primary opacity-70">
            [Stimulus pack del concept — da implementare]
          </p>
        </section>

        <form action={submitSPResponse} className="mt-12">
          <input type="hidden" name="surveyId" value={survey.id} />
          <input type="hidden" name="token" value={token} />

          {config.dimensions.map((dimension, index) => (
            <section
              key={dimension.id}
              className={index === 0 ? "" : "mt-16"}
            >
              <h2 className="font-heading text-lead font-medium leading-normal text-fg-primary">
                {dimension.number} — {dimension.title}
              </h2>
              <p className="mt-2 font-sans text-body leading-relaxed text-fg-primary opacity-70">
                {dimension.description}
              </p>

              {dimension.items.map((item) => (
                <SurveyItem
                  key={item.id}
                  item={item}
                  method={dimension.method}
                  scaleMin={config.scaleMin}
                  scaleMax={config.scaleMax}
                />
              ))}
            </section>
          ))}

          <div className="mt-16">
            <button
              type="submit"
              className="cursor-pointer border-none bg-accent-primary px-6 py-[14px] font-sans text-body font-medium leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-90"
            >
              Invia risposte
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
