"use client";

import { useEffect, useState } from "react";
import type { Concept } from "@/src/data/concepts";
import { getQuadrant, isPlaceholderConcept } from "@/src/data/concepts";
import { getBozzaPlaceholderSrc } from "@/src/lib/bozza-placeholder";
import InfoIcon from "@/app/components/InfoIcon";
import OverlayLightbox from "@/app/components/OverlayLightbox";

interface Props {
  concept: Concept;
  /**
   * Se false, CFML non è ancora disponibile (hub privata in bozza).
   * Default true: comportamento attuale di /archivio.
   */
  cfmlAvailable?: boolean;
  /**
   * Se false, SP non è ancora disponibile (hub privata in bozza).
   * Default true: comportamento attuale di /archivio.
   */
  spAvailable?: boolean;
  /**
   * Se true e non ci sono immagini, usa /bozza/N.svg (deterministico sull'id)
   * al posto del rettangolo grigio. Default false: /archivio invariato.
   */
  useBozzaPlaceholder?: boolean;
}

const GALLERY_BTN =
  "size-[29px] flex items-center justify-center border border-fg-primary bg-bg-elevated font-mono text-metadata text-fg-primary leading-none transition-colors duration-150 ease-out";

function ConceptHeroImage({ src, alt }: { src: string; alt: string }) {
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

export default function ConceptHero({
  concept,
  cfmlAvailable = true,
  spAvailable = true,
  useBozzaPlaceholder = false,
}: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const imageCount = concept.images.length;
  const hasMultipleImages = imageCount > 1;
  const currentImage = imageCount > 0 ? concept.images[currentImageIndex] : null;
  const bozzaSrc =
    !currentImage && useBozzaPlaceholder
      ? getBozzaPlaceholderSrc(concept.id)
      : null;
  const displayImage = currentImage ?? bozzaSrc;
  const isBozzaImage = Boolean(bozzaSrc);
  const quadrant = getQuadrant(concept);
  const isDemoPlaceholder = isPlaceholderConcept(concept);
  const showPlaceholderBadge = isDemoPlaceholder || isBozzaImage;

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
    <div className="w-[1160px]">
      {/* ── Hero box ── */}
      <div className="relative flex border border-fg-primary bg-bg-elevated">
        {/* ── Etichetta PLACEHOLDER — concept dimostrativi o immagine bozza ──
            Tipografia metadata, affiancata dall'icona informativa condivisa
            (stessa usata nelle intestazioni della matrice /archivio). */}
        {showPlaceholderBadge && (
          <div className="absolute left-[16px] top-[16px] z-20">
            <div className="flex items-center gap-[8px] border border-fg-primary bg-bg-elevated px-[10px] py-[7px]">
              <span className="font-mono text-metadata uppercase text-fg-primary leading-none">
                PLACEHOLDER
              </span>
              <button
                type="button"
                aria-label={
                  isBozzaImage && !isDemoPlaceholder
                    ? "Cos'è questo segnaposto immagine"
                    : "Cos'è un concept dimostrativo"
                }
                aria-expanded={infoOpen}
                onClick={() => setInfoOpen((prev) => !prev)}
                className="flex items-center"
              >
                <InfoIcon />
              </button>
            </div>
            {infoOpen && (
              <div
                role="tooltip"
                className="mt-[8px] w-[320px] border border-fg-primary bg-bg-elevated p-[12px]"
              >
                <p className="font-mono text-metadata text-fg-primary leading-normal">
                  {isBozzaImage && !isDemoPlaceholder ? (
                    <>
                      Immagine non ancora caricata. Questo segnaposto resta fino
                      a quando non aggiungi una foto del concept.
                    </>
                  ) : (
                    <>
                      Concept dimostrativo. Immagini e punteggi sono generati
                      per popolare l&apos;archivio e illustrare il
                      funzionamento della piattaforma. I dati reali provengono
                      dalle valutazioni CFML e dalle rilevazioni SP dei concept
                      analizzati.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Left column — image */}
        <div className="size-[580px] shrink-0 border-r border-fg-primary overflow-hidden">
          {displayImage ? (
            isBozzaImage ? (
              <div className="size-full bg-accent-tertiary" aria-hidden="true">
                <ConceptHeroImage src={displayImage} alt="" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="group relative size-full cursor-zoom-in"
                aria-label="Ingrandisci immagine"
              >
                <ConceptHeroImage src={displayImage} alt={concept.title} />
                <div
                  className="pointer-events-none absolute inset-0 bg-fg-primary/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </button>
            )
          ) : (
            <div className="size-full bg-accent-tertiary" aria-hidden="true" />
          )}
        </div>

          {/* Right column — content */}
          <div className="relative size-[580px] shrink-0">
            {/* NR. number — vertical, inner right edge (Figma: x=1280 y=168, bbox 19×65) */}
            {concept.number ? (
              <div className="pointer-events-none absolute right-[21px] top-[35px] flex h-[65px] w-[19px] items-center justify-center">
                <p className="rotate-90 whitespace-nowrap font-mono text-metadata text-fg-primary uppercase leading-normal">
                  {concept.number}
                </p>
              </div>
            ) : null}

            <div className="flex h-full flex-col pl-[31px] pr-[20px] pt-[31px] pb-[24px]">
              {/* Title + tagline */}
              <h1 className="font-heading font-bold text-h1 leading-[60px] text-fg-primary uppercase">
                {concept.title}
              </h1>
              {concept.tagline ? (
                <p className="mt-[7px] font-sans text-[30px] uppercase leading-[38px] text-fg-primary">
                  {concept.tagline}
                </p>
              ) : null}

              {/* Metrics */}
              <div className="mt-[14px] flex items-baseline gap-[31px] uppercase text-fg-primary">
                <p className="font-sans text-display font-medium leading-normal">
                  {cfmlAvailable ? `CFML: ${concept.cfml}` : "CFML: -"}
                </p>
                <p className="font-sans leading-[60px]">
                  {spAvailable ? (
                    <>
                      <span className="text-display font-medium">
                        SP: {concept.sp}
                      </span>
                      <span className="text-body font-normal normal-case">
                        {" "}
                        su {concept.spResponses} risposte
                      </span>
                    </>
                  ) : (
                    <span className="text-display font-medium">SP: -</span>
                  )}
                </p>
              </div>

              {/* Description */}
              {concept.description ? (
                <p className="mt-[18px] font-sans text-body text-fg-primary leading-normal">
                  {concept.description}
                </p>
              ) : null}

              {/* Tags */}
              {concept.tags.length > 0 ? (
                <p className="mt-[20px] font-mono text-metadata text-fg-primary leading-normal">
                  {concept.tags.map((tag) => `#${tag}`).join(" ")}
                </p>
              ) : null}

              {/* Bottom row — quadrant + author */}
              <div className="mt-auto flex items-end justify-between">
                <div
                  className="flex size-[28px] items-center justify-center border border-fg-primary font-mono text-metadata text-fg-primary leading-none"
                  aria-label={
                    cfmlAvailable && spAvailable
                      ? `Quadrante ${quadrant}`
                      : "Quadrante non ancora disponibile"
                  }
                >
                  {cfmlAvailable && spAvailable ? quadrant : "—"}
                </div>

                {(concept.author.name || concept.author.handle) ? (
                  <div className="flex items-center gap-[12px]">
                    <div className="text-right">
                      {concept.author.name ? (
                        <p className="font-sans text-body text-fg-primary leading-normal">
                          {concept.author.name}
                        </p>
                      ) : null}
                      {concept.author.handle ? (
                        <p className="font-sans text-body text-fg-primary leading-normal">
                          {concept.author.handle}
                        </p>
                      ) : null}
                    </div>
                    <div
                      className="size-[50px] shrink-0 rounded-full border border-fg-primary bg-accent-tertiary"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
      </div>

      {/* ── Gallery controls ── */}
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
        {hasMultipleImages && (
          <p className="font-mono text-metadata text-fg-primary leading-normal">
            {currentImageIndex + 1} / {imageCount}
          </p>
        )}
      </div>

      {/* ── Lightbox ── */}
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
              <p className="font-mono text-metadata text-fg-primary leading-normal">
                {currentImageIndex + 1} / {imageCount}
              </p>
            </div>
          ) : null
        }
      >
        {currentImage ? (
          <LightboxImage src={currentImage} alt={concept.title} />
        ) : null}
      </OverlayLightbox>
    </div>
  );
}
