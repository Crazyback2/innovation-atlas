export type StimulusPackSnapshot = {
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

export default function StimulusPackPreview({
  pack,
}: {
  pack: StimulusPackSnapshot;
}) {
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

      <h2 className="mt-4 font-heading text-display font-medium leading-normal text-fg-primary">
        {pack.title}
      </h2>

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
