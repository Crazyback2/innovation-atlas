import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import type { SPConfig, SPItem, SPMethod } from "@/src/data/sp-config/types";
import { submitSPResponse } from "./actions";

type PageProps = {
  params: Promise<{ token: string }>;
};

type PackSnapshot = {
  title: string;
  description: string | null;
  sector: string;
  context_scenario: string | null;
  target_user: string | null;
  images: string[];
  image_captions: Record<string, string>;
  video_url: string | null;
};

const metadataLabelClassName =
  "font-mono text-metadata uppercase leading-normal tracking-wide text-fg-primary";

function hasText(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
}

function isEmbeddableVideoUrl(url: string): boolean {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")
  );
}

function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "youtu.be") {
      let videoId: string | null = null;

      if (host === "youtu.be") {
        videoId = parsed.pathname.slice(1).split("/")[0] || null;
      } else if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v");
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.slice("/embed/".length).split("/")[0] || null;
      } else if (parsed.pathname.startsWith("/shorts/")) {
        videoId = parsed.pathname.slice("/shorts/".length).split("/")[0] || null;
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (host === "vimeo.com") {
      const match = parsed.pathname.match(/^\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }

    if (host === "player.vimeo.com") {
      const match = parsed.pathname.match(/^\/video\/(\d+)/);
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function StimulusPack({ pack }: { pack: PackSnapshot }) {
  const images = pack.images ?? [];
  const captions = pack.image_captions ?? {};
  const heroImage = images[0];
  const heroCaption = captions["0"];
  const additionalImages = images.slice(1, 5);

  return (
    <section className="mt-8">
      {heroImage ? (
        <div className="py-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={hasText(heroCaption) ? heroCaption : pack.title}
            className="block h-[480px] max-h-[480px] w-full object-cover"
          />
          {hasText(heroCaption) ? (
            <p className="mt-2 font-sans text-metadata leading-normal text-fg-primary opacity-70">
              {heroCaption}
            </p>
          ) : null}
        </div>
      ) : null}

      <p
        className={`${metadataLabelClassName} inline-block border border-accent-tertiary px-3 py-1`}
      >
        {pack.sector}
      </p>

      <h1 className="mt-4 font-heading text-display font-medium leading-normal text-fg-primary">
        {pack.title}
      </h1>

      {hasText(pack.description) ? (
        <p className="mt-4 font-sans text-lead leading-relaxed text-fg-primary">
          {pack.description}
        </p>
      ) : null}

      {hasText(pack.context_scenario) ? (
        <div className="py-6">
          <p className={metadataLabelClassName}>Contesto d&apos;uso:</p>
          <p className="mt-2 font-sans text-body leading-relaxed text-fg-primary">
            {pack.context_scenario}
          </p>
        </div>
      ) : null}

      {hasText(pack.target_user) ? (
        <div className="py-6">
          <p className={metadataLabelClassName}>Utente target:</p>
          <p className="mt-2 font-sans text-body leading-relaxed text-fg-primary">
            {pack.target_user}
          </p>
        </div>
      ) : null}

      {additionalImages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
          {additionalImages.map((imageUrl, index) => {
            const imageIndex = index + 1;
            const caption = captions[String(imageIndex)];

            return (
              <figure key={`${imageUrl}-${imageIndex}`} className="flex flex-col gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={
                    hasText(caption)
                      ? caption
                      : `${pack.title} — immagine ${imageIndex + 1}`
                  }
                  className="max-h-[240px] max-w-[240px] rounded-sm object-cover"
                />
                {hasText(caption) ? (
                  <figcaption className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                    {caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      ) : null}

      {hasText(pack.video_url) ? (
        <div className="py-6">
          <p className={metadataLabelClassName}>Guarda il video</p>
          {(() => {
            const embedUrl = isEmbeddableVideoUrl(pack.video_url)
              ? getVideoEmbedUrl(pack.video_url)
              : null;

            if (embedUrl) {
              return (
                <div className="mt-4 aspect-video w-full">
                  <iframe
                    src={embedUrl}
                    title="Video del concept"
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            }

            return (
              <a
                href={pack.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block break-all font-sans text-body leading-normal text-fg-primary underline transition-opacity duration-150 ease-out hover:opacity-80"
              >
                {pack.video_url}
              </a>
            );
          })()}
        </div>
      ) : null}
    </section>
  );
}

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

  const pack = survey.pack_snapshot as PackSnapshot | null;
  if (!pack?.title || !pack.sector) {
    notFound();
  }

  const config = survey.config_snapshot as SPConfig;

  return (
    <div className="min-h-screen bg-bg-primary py-16 font-sans">
      <main className="mx-auto w-full max-w-[720px] px-6">
        <header>
          <p className="font-heading text-lead font-medium leading-normal text-fg-primary">
            Valuta il concept
          </p>
          <p className="mt-2 font-sans text-body leading-relaxed text-fg-primary opacity-70">
            Rispondi alle domande seguenti in base alla tua prima impressione del
            concept.
          </p>
        </header>

        <StimulusPack pack={pack} />

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
