"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Concept } from "@/src/data/concepts";
import { getQuadrant } from "@/src/data/concepts";

interface Props {
  concept: Concept;
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

export default function ConceptHero({ concept }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imageCount = concept.images.length;
  const hasMultipleImages = imageCount > 1;
  const currentImage = imageCount > 0 ? concept.images[currentImageIndex] : null;
  const quadrant = getQuadrant(concept);

  function goToPrevious() {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  }

  function goToNext() {
    if (!hasMultipleImages) return;
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, hasMultipleImages, imageCount]);

  return (
    <div className="w-[1160px]">
      {/* ── Hero box ── */}
      <div className="flex border border-fg-primary bg-bg-elevated">
        {/* Left column — image */}
        <div className="size-[580px] shrink-0 border-r border-fg-primary overflow-hidden">
          {currentImage ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group relative size-full cursor-zoom-in"
              aria-label="Ingrandisci immagine"
            >
              <ConceptHeroImage src={currentImage} alt={concept.title} />
              <div
                className="pointer-events-none absolute inset-0 bg-fg-primary/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                aria-hidden="true"
              />
            </button>
          ) : (
            <div className="size-full bg-accent-tertiary" aria-hidden="true" />
          )}
        </div>

        {/* Right column — content */}
        <div className="relative size-[580px] shrink-0">
          {/* NR. number — vertical, inner right edge (Figma: x=1280 y=168, bbox 19×65) */}
          <div className="pointer-events-none absolute right-[21px] top-[35px] flex h-[65px] w-[19px] items-center justify-center">
            <p className="rotate-90 whitespace-nowrap font-mono text-metadata text-fg-primary uppercase leading-normal">
              {concept.number}
            </p>
          </div>

          <div className="flex h-full flex-col pl-[31px] pr-[20px] pt-[31px] pb-[24px]">
            {/* Title + tagline */}
            <h1 className="font-heading font-bold text-h1 leading-[60px] text-fg-primary uppercase">
              {concept.title}
            </h1>
            <p className="mt-[7px] font-sans text-[30px] uppercase leading-[38px] text-fg-primary">
              {concept.tagline}
            </p>

            {/* Metrics */}
            <div className="mt-[14px] flex items-baseline gap-[31px] uppercase text-fg-primary">
              <p className="font-sans text-display font-medium leading-normal">
                CFML: {concept.cfml}
              </p>
              <p className="font-sans leading-[60px]">
                <span className="text-display font-medium">SP: {concept.sp}</span>
                <span className="text-body font-normal normal-case">
                  {" "}
                  su {concept.spResponses} risposte
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="mt-[18px] font-sans text-body text-fg-primary leading-normal">
              {concept.description}
            </p>

            {/* Tags */}
            <p className="mt-[20px] font-mono text-metadata text-fg-primary leading-normal">
              {concept.tags.map((tag) => `#${tag}`).join(" ")}
            </p>

            {/* Bottom row — quadrant + author */}
            <div className="mt-auto flex items-end justify-between">
              <div
                className="flex size-[28px] items-center justify-center border border-fg-primary font-mono text-metadata text-fg-primary leading-none"
                aria-label={`Quadrante ${quadrant}`}
              >
                {quadrant}
              </div>

              <div className="flex items-center gap-[12px]">
                <div className="text-right">
                  <p className="font-sans text-body text-fg-primary leading-normal">
                    {concept.author.name}
                  </p>
                  <p className="font-sans text-body text-fg-primary leading-normal">
                    {concept.author.handle}
                  </p>
                </div>
                <div
                  className="size-[50px] shrink-0 rounded-full border border-fg-primary bg-accent-tertiary"
                  aria-hidden="true"
                />
              </div>
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
      {lightboxOpen && currentImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galleria immagini"
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-elevated/80 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Chiudi"
            onClick={() => setLightboxOpen(false)}
            className={`${GALLERY_BTN} absolute top-8 left-8 cursor-pointer hover:bg-accent-primary`}
          >
            <X className="size-3.5" strokeWidth={1.5} />
          </button>

          <LightboxImage src={currentImage} alt={concept.title} />

          {hasMultipleImages && (
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
          )}
        </div>
      )}
    </div>
  );
}
