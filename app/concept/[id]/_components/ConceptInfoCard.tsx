import { ChevronDown } from "lucide-react";

const DESCRIPTION =
  "Grogolix riconfigura il piano cottura in quattro zone-modulo intercambiabili: induzione, vapore passivo, fermentazione lenta, conservazione. Il telaio è un'unica fusione di alluminio riciclato; ogni modulo si aggancia magneticamente e dialoga con un controller a led-matrix.";

const HASHTAGS =
  "#homeappliance #industrialdesign #product #wearable";

export default function ConceptInfoCard() {
  return (
    <section
      aria-labelledby="concept-info-title"
      className="relative flex min-h-[577px] flex-col border border-fg-primary bg-bg-elevated px-10 pb-6 pt-[31px]"
    >
      <div
        aria-hidden="true"
        className="absolute right-6 top-[21px] size-16 border border-fg-primary bg-bg-elevated"
      />

      <h1
        id="concept-info-title"
        className="font-heading text-h1 font-bold uppercase leading-[60px] text-fg-primary"
      >
        POD
      </h1>

      <p className="font-sans text-display-caps uppercase leading-[60px] text-fg-primary">
        RECYCLING LAMP
      </p>

      <p className="mt-[7px] font-sans text-body leading-normal text-accent-secondary">
        Created on 19/03/26
      </p>

      <div className="mt-2 flex items-baseline gap-[31px] uppercase text-fg-primary">
        <p className="font-sans text-display font-medium leading-normal">
          CFML: -
        </p>
        <p className="font-sans leading-[60px]">
          <span className="text-display font-medium">SP: -</span>
          <span className="text-body font-normal normal-case">
            {" "}
            su - risposte
          </span>
        </p>
      </div>

      <div className="mt-[14px] flex h-[29px] w-[203px] items-center gap-[10px] border border-fg-primary bg-bg-elevated px-[10px] pb-[7px] pt-2">
        <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
          SETTORE
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-metadata leading-normal text-fg-primary"
        >
          |
        </span>
        <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
          CASA E ABITARE
        </span>
        <ChevronDown
          aria-hidden="true"
          className="ml-auto size-3 shrink-0 text-fg-primary"
          strokeWidth={1.5}
        />
      </div>

      <p className="mt-[18px] max-w-[725px] font-sans text-body leading-normal text-fg-primary">
        {DESCRIPTION}
      </p>

      <p className="mt-5 font-mono text-metadata leading-normal text-fg-primary">
        {HASHTAGS}
      </p>

      <div className="mt-auto flex items-end justify-end gap-3 pt-5">
        <div className="text-right">
          <p className="font-sans text-body leading-normal text-fg-primary">
            Lorenzo Romano
          </p>
          <p className="font-sans text-body leading-normal text-accent-secondary">
            @crazyback2
          </p>
        </div>
        <div
          aria-hidden="true"
          className="size-[50px] shrink-0 rounded-full border border-fg-primary bg-accent-tertiary"
        />
      </div>
    </section>
  );
}
