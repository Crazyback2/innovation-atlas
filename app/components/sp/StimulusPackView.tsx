import StartSurveyButton from "./StartSurveyButton";
import StimulusPackHero from "./StimulusPackHero";

export type StimulusPackData = {
  title: string;
  description: string | null;
  sector: string;
  context_scenario: string | null;
  target_user: string | null;
  images: string[];
  image_captions: Record<string, string>;
  video_url: string | null;
};

/** @deprecated Prefer StimulusPackData — alias kept for existing imports. */
export type StimulusPackSnapshot = StimulusPackData;

const INTRO_TEXT =
  "Qui sotto trovi la presentazione di un concept di prodotto. Prenditi il tempo di guardarla: immagini, descrizione e contesto d'uso sono il materiale su cui ti chiederemo di rispondere. Le domande che seguono riguardano l'impressione che il concept ti lascia, non le sue caratteristiche tecniche. Non ci sono risposte giuste o sbagliate, e la prima impressione è quella che ci interessa.";

function DashedDivider() {
  return (
    <div
      className="w-full border-t border-dashed border-fg-primary"
      aria-hidden="true"
    />
  );
}

type StimulusPackViewProps = {
  pack: StimulusPackData;
  /**
   * `respondent` — shell Figma (meta, intro, divider, CTA scroll).
   * `preview` — solo pack hero, nessuna CTA.
   */
  variant: "respondent" | "preview";
  /** Required when variant is `respondent`: id of the questionnaire section. */
  surveySectionId?: string;
};

export default function StimulusPackView({
  pack,
  variant,
  surveySectionId,
}: StimulusPackViewProps) {
  if (variant === "preview") {
    return (
      <div className="mt-8">
        <StimulusPackHero pack={pack} />
      </div>
    );
  }

  if (!surveySectionId) {
    throw new Error(
      'StimulusPackView: surveySectionId is required for variant="respondent".'
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-start justify-between gap-6">
        <p className="font-mono text-metadata leading-normal text-fg-primary">
          Innovation Atlas // V.01
        </p>
        <p className="font-mono text-metadata leading-normal text-fg-primary text-right">
          // Politecnico di Milano
        </p>
      </div>

      <h1 className="font-heading text-hero font-bold uppercase leading-[80px] text-fg-primary">
        Percezione
        <br />
        Simbolica
      </h1>

      <p className="max-w-wizard font-sans text-body leading-normal text-fg-primary">
        {INTRO_TEXT}
      </p>

      <DashedDivider />

      <StimulusPackHero pack={pack} />

      <DashedDivider />

      <div className="flex flex-col items-center gap-6">
        <p className="max-w-wizard text-center font-sans text-body leading-normal text-fg-primary">
          Quando hai finito di guardare, puoi iniziare.
        </p>
        <StartSurveyButton targetId={surveySectionId} />
      </div>
    </div>
  );
}
