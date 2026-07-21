"use client";

import { useEffect, useState, type ReactNode } from "react";
import OverlayLightbox from "@/app/components/OverlayLightbox";
import type { StimulusPackData } from "./StimulusPackView";

const GALLERY_BTN =
  "size-[29px] flex items-center justify-center border border-fg-primary bg-bg-elevated font-mono text-metadata text-fg-primary leading-none transition-colors duration-150 ease-out";

const metadataLabelClassName =
  "font-mono text-metadata uppercase leading-normal tracking-wide text-fg-primary";

function hasText(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
}

function PackImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="size-full bg-accent-tertiary" aria-hidden="true" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="size-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="size-[200px] bg-accent-tertiary" aria-hidden="true" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="max-h-[80vh] max-w-[80vw] object-contain"
      onError={() => setFailed(true)}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

const fieldBodyClassName =
  "min-w-0 max-w-full break-words font-sans text-body leading-normal text-fg-primary";

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className={metadataLabelClassName}>{label}</p>
      {children}
    </div>
  );
}

/**
 * Pack layout allineato a ConceptHero: riquadro a due colonne, gallery sotto
 * l'immagine. Solo campi pack_snapshot — niente CFML/SP/quadrante/autore/
 * tagline/tag/numero.
 */
export default function StimulusPackHero({ pack }: { pack: StimulusPackData }) {
  const images = (pack.images ?? []).filter(Boolean);
  const captions = pack.image_captions ?? {};
  const imageCount = images.length;
  const hasMultipleImages = imageCount > 1;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeIndex =
    imageCount === 0 ? 0 : Math.min(currentImageIndex, imageCount - 1);
  const currentImage = imageCount > 0 ? images[safeIndex] : null;
  const currentCaption = captions[String(safeIndex)];
  const imageAlt = hasText(currentCaption) ? currentCaption : pack.title;

  function goToPrevious() {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  }

  function goToNext() {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  }

  useEffect(() => {
    if (!lightboxOpen || !hasMultipleImages) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, hasMultipleImages, imageCount]);

  return (
    <div className="w-full max-w-[1160px]">
      <div className="flex w-full min-w-0 items-start gap-8">
        {/* Left frame — image only, fixed square; does not stretch with text */}
        <div className="w-[580px] shrink-0">
          <div className="size-[580px] overflow-hidden border border-fg-primary bg-bg-elevated">
            {currentImage ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="group relative size-full cursor-zoom-in"
                aria-label="Ingrandisci immagine"
              >
                <PackImage src={currentImage} alt={imageAlt} />
                <div
                  className="pointer-events-none absolute inset-0 bg-fg-primary/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            ) : (
              <div className="size-full bg-accent-tertiary" aria-hidden="true" />
            )}
          </div>

          {/* Gallery controls — under the image frame */}
          <div className="mt-[8px] flex items-center gap-[8px]">
            <button
              type="button"
              aria-label="Immagine precedente"
              disabled={!hasMultipleImages}
              onClick={goToPrevious}
              className={`${GALLERY_BTN} ${
                hasMultipleImages
                  ? "cursor-pointer hover:bg-accent-primary"
                  : "cursor-not-allowed opacity-30"
              }`}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Immagine successiva"
              disabled={!hasMultipleImages}
              onClick={goToNext}
              className={`${GALLERY_BTN} ${
                hasMultipleImages
                  ? "cursor-pointer hover:bg-accent-primary"
                  : "cursor-not-allowed opacity-30"
              }`}
            >
              →
            </button>
            {hasMultipleImages ? (
              <p className="font-mono text-metadata leading-normal text-fg-primary">
                {safeIndex + 1} / {imageCount}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right frame — text fields; free to grow taller than the image */}
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-x-hidden border border-fg-primary bg-bg-elevated pl-[31px] pr-[20px] pt-[31px] pb-[24px]">
          <FieldBlock label="Titolo">
            <h2 className="min-w-0 max-w-full break-words font-heading text-h1 font-bold uppercase leading-[60px] text-fg-primary">
              {pack.title}
            </h2>
          </FieldBlock>

          <FieldBlock label="Settore">
            <p className={fieldBodyClassName}>{pack.sector}</p>
          </FieldBlock>

          {hasText(pack.description) ? (
            <FieldBlock label="Descrizione">
              <p className={fieldBodyClassName}>{pack.description}</p>
            </FieldBlock>
          ) : null}

          {hasText(pack.context_scenario) ? (
            <FieldBlock label="Contesto scenario">
              <p className={fieldBodyClassName}>{pack.context_scenario}</p>
            </FieldBlock>
          ) : null}

          {hasText(pack.target_user) ? (
            <FieldBlock label="Utente target">
              <p className={fieldBodyClassName}>{pack.target_user}</p>
            </FieldBlock>
          ) : null}

          {hasText(pack.video_url) ? (
            <FieldBlock label="Video">
              <a
                href={pack.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${fieldBodyClassName} underline transition-opacity duration-150 ease-out hover:opacity-80`}
              >
                Guarda il video
              </a>
            </FieldBlock>
          ) : null}
        </div>
      </div>

      <OverlayLightbox
        open={lightboxOpen && Boolean(currentImage)}
        onClose={() => setLightboxOpen(false)}
        label="Galleria immagini"
        contentClassName=""
        footer={
          hasMultipleImages ? (
            <div
              className="absolute bottom-8 left-8 flex items-center gap-[8px]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Immagine precedente"
                onClick={goToPrevious}
                className={`${GALLERY_BTN} cursor-pointer hover:bg-accent-primary`}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Immagine successiva"
                onClick={goToNext}
                className={`${GALLERY_BTN} cursor-pointer hover:bg-accent-primary`}
              >
                →
              </button>
              <p className="font-mono text-metadata leading-normal text-fg-primary">
                {safeIndex + 1} / {imageCount}
              </p>
            </div>
          ) : null
        }
      >
        {currentImage ? (
          <LightboxImage src={currentImage} alt={imageAlt} />
        ) : null}
      </OverlayLightbox>
    </div>
  );
}
