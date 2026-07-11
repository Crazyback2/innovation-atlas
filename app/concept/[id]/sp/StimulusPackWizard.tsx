"use client";

import { useState, type ChangeEvent } from "react";
import { VALID_SECTORS } from "@/app/concept/new/data";

export type StimulusPack = {
  descrizione: string;
  contesto_scenario: string;
  target_user: string;
  images: string[];
  captions: Record<string, string>;
  video_url: string;
  sector: string;
  tags: string[];
};

type StimulusPackWizardProps = {
  conceptId: string;
};

const MAX_DESCRIPTION = 350;
const MAX_CONTEXT = 500;
const MAX_TARGET = 120;
const MAX_CAPTION = 60;
const MAX_IMAGES = 5;
const MAX_TAGS = 5;

const metadataBadgeClassName =
  "inline-flex shrink-0 items-center gap-2.5 border border-fg-primary bg-bg-elevated px-2.5 py-2";

const limitHintClassName =
  "shrink-0 font-sans text-body font-bold uppercase leading-normal text-fg-primary";

const fieldShellClassName =
  "relative flex min-w-0 flex-col border border-fg-primary bg-bg-elevated";

const fieldLabelClassName =
  "px-3 pt-3 font-sans text-body font-bold uppercase leading-normal text-fg-primary";

const fieldControlClassName =
  "min-w-0 w-full resize-none border-none bg-transparent px-3 pb-3 font-sans text-body leading-normal text-fg-primary outline-none placeholder:text-border-muted";

const counterClassName =
  "px-3 pb-2 font-sans text-metadata leading-normal text-fg-primary opacity-50";

const slotInputClassName =
  "min-w-0 w-full border border-fg-primary bg-bg-elevated px-3 py-2 font-sans text-body leading-normal text-fg-primary outline-none placeholder:text-border-muted focus:border-fg-primary";

const emptyStackLayers = [
  { offset: "translate-x-0 z-40", size: "h-96 w-full max-w-md" },
  { offset: "translate-x-6 z-30", size: "h-80 w-full max-w-sm" },
  { offset: "translate-x-12 z-20", size: "h-72 w-full max-w-xs" },
  { offset: "translate-x-16 z-10", size: "h-64 w-full max-w-64" },
];

const initialPack: StimulusPack = {
  descrizione: "",
  contesto_scenario: "",
  target_user: "",
  images: [],
  captions: {},
  video_url: "",
  sector: "",
  tags: [],
};

function counterClass(isOverLimit: boolean): string {
  return isOverLimit
    ? "px-3 pb-2 font-sans text-metadata leading-normal text-error"
    : counterClassName;
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 13"
      className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-fg-primary"
      fill="none"
    >
      <path
        d="M2 4.5L6 8.5L10 4.5"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 8 8"
      className={`size-2 text-fg-primary ${direction === "left" ? "rotate-180" : ""}`}
      fill="currentColor"
    >
      <path d="M0 4L6 0V8L0 4Z" />
    </svg>
  );
}

function DropzoneCross() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <span className="absolute h-px w-3/4 rotate-45 bg-border-muted" />
      <span className="absolute h-px w-3/4 -rotate-45 bg-border-muted" />
    </span>
  );
}

function LimitHint({ children }: { children: string }) {
  return <span className={limitHintClassName}>{children}</span>;
}

function CompletionBar({ pack }: { pack: StimulusPack }) {
  const hasSector = Boolean(pack.sector.trim());
  const hasDescription = Boolean(pack.descrizione.trim());
  const hasContextAndTarget =
    Boolean(pack.contesto_scenario.trim()) && Boolean(pack.target_user.trim());
  const hasImages = pack.images.filter(Boolean).length >= 3;

  const segments = [hasSector, hasDescription, hasContextAndTarget, hasImages];

  return (
    <div
      aria-hidden
      className="grid min-w-0 flex-1 grid-cols-12 gap-px"
    >
      {segments.map((filled, index) => (
        <span
          key={index}
          className={`col-span-3 h-3.5 ${
            filled ? "bg-accent-primary" : "bg-accent-tertiary"
          }`}
        />
      ))}
    </div>
  );
}

type GallerySectionProps = {
  images: string[];
  captions: Record<string, string>;
  onImagesChange: (images: string[]) => void;
  onCaptionsChange: (captions: Record<string, string>) => void;
};

function GallerySection({
  images,
  captions,
  onImagesChange,
  onCaptionsChange,
}: GallerySectionProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [urlDraft, setUrlDraft] = useState("");

  const filledImages = images.filter(Boolean);
  const filledCount = filledImages.length;
  const activePreview =
    filledCount > 0
      ? filledImages[Math.min(galleryIndex, filledCount - 1)]
      : null;

  const slotCount = (() => {
    const filledLength = images.length;
    const base = Math.max(3, filledLength);
    const lastFilled = images[filledLength - 1]?.trim();
    const withExtra =
      lastFilled && filledLength < MAX_IMAGES ? filledLength + 1 : base;
    return Math.min(MAX_IMAGES, Math.max(3, withExtra));
  })();

  function handlePrevImage() {
    if (filledCount === 0) {
      return;
    }
    setGalleryIndex((current) =>
      current === 0 ? filledCount - 1 : current - 1
    );
  }

  function handleNextImage() {
    if (filledCount === 0) {
      return;
    }
    setGalleryIndex((current) =>
      current === filledCount - 1 ? 0 : current + 1
    );
  }

  function handleSlotUrlChange(index: number, value: string) {
    const nextImages = [...images];
    while (nextImages.length <= index) {
      nextImages.push("");
    }
    nextImages[index] = value;
    onImagesChange(nextImages.slice(0, MAX_IMAGES));
  }

  function handleCaptionChange(index: number, value: string) {
    onCaptionsChange({
      ...captions,
      [String(index)]: value,
    });
  }

  function handleAddFromDraft() {
    const trimmed = urlDraft.trim();
    if (!trimmed) {
      return;
    }

    const emptyIndex = images.findIndex((url) => !url.trim());
    const targetIndex = emptyIndex === -1 ? images.length : emptyIndex;

    if (targetIndex >= MAX_IMAGES) {
      return;
    }

    handleSlotUrlChange(targetIndex, trimmed);
    setUrlDraft("");
    setGalleryIndex(
      filledCount === 0 ? 0 : Math.min(galleryIndex, filledCount)
    );
  }

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <h2 className="font-sans text-display-caps uppercase leading-none text-fg-primary">
          Galleria
        </h2>
        <LimitHint>[1 immagine hero + 2 obbligatorie, limite 5]</LimitHint>
      </div>

      <div className="border-t border-fg-primary" />

      <div className="flex min-w-0 items-start justify-between gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="relative min-h-96 w-full min-w-0">
            {activePreview ? (
              <div className="absolute top-0 left-0 z-40 h-96 w-full max-w-md overflow-hidden border border-fg-primary bg-bg-primary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePreview}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
            ) : (
              emptyStackLayers.map((layer) => (
                <div
                  key={layer.offset}
                  className={`absolute top-0 left-0 border border-fg-primary bg-bg-primary ${layer.size} ${layer.offset}`}
                />
              ))
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Immagine precedente"
              disabled={filledCount === 0}
              onClick={handlePrevImage}
              className="flex size-7 shrink-0 items-center justify-center border border-fg-primary bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label="Immagine successiva"
              disabled={filledCount === 0}
              onClick={handleNextImage}
              className="flex size-7 shrink-0 items-center justify-center border border-fg-primary bg-bg-elevated disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>

        <div className="relative flex min-h-48 w-44 shrink-0 flex-col justify-center gap-3 border border-dashed border-fg-primary bg-bg-elevated p-3">
          <DropzoneCross />
          <div className="relative z-10 flex min-w-0 flex-col gap-2">
            <p className="text-center font-sans text-body font-bold uppercase leading-normal text-fg-primary">
              Inserisci
              <br />
              immagine
              <br />
              {filledCount}/{MAX_IMAGES}
            </p>
            <input
              type="url"
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleAddFromDraft();
                }
              }}
              placeholder="Incolla URL"
              className="min-w-0 w-full border border-fg-primary bg-bg-elevated px-2 py-1.5 text-center font-sans text-metadata leading-normal text-fg-primary outline-none placeholder:text-border-muted"
            />
            <button
              type="button"
              onClick={handleAddFromDraft}
              className="border border-fg-primary bg-bg-primary px-2 py-1 font-sans text-metadata uppercase leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-80"
            >
              Aggiungi
            </button>
          </div>
        </div>
      </div>

      <ul className="flex min-w-0 flex-col gap-4">
        {Array.from({ length: slotCount }, (_, index) => {
          const url = images[index] ?? "";
          const caption = captions[String(index)] ?? "";
          const slotLabel =
            index === 0 ? "Immagine principale (hero)" : `Immagine ${index + 1}`;

          return (
            <li
              key={`image-slot-${index}`}
              className="flex min-w-0 flex-col gap-2 border border-fg-primary bg-bg-elevated p-4"
            >
              <span className="font-mono text-metadata uppercase leading-normal text-fg-primary">
                {slotLabel}
              </span>
              <input
                type="url"
                value={url}
                onChange={(event) =>
                  handleSlotUrlChange(index, event.target.value)
                }
                placeholder="Incolla URL immagine"
                className={slotInputClassName}
              />
              {url.trim() ? (
                <div className="overflow-hidden border border-fg-primary bg-bg-primary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={caption || slotLabel}
                    className="max-h-48 w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="flex min-w-0 flex-col gap-1">
                <label
                  htmlFor={`caption-${index}`}
                  className="font-sans text-metadata leading-normal text-fg-primary opacity-70"
                >
                  Didascalia (opzionale)
                </label>
                <input
                  id={`caption-${index}`}
                  type="text"
                  value={caption}
                  onChange={(event) =>
                    handleCaptionChange(index, event.target.value)
                  }
                  placeholder="Breve descrizione dell'immagine"
                  className={slotInputClassName}
                />
                <span className={counterClass(caption.length > MAX_CAPTION)}>
                  {caption.length}/{MAX_CAPTION}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type TextareaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  limitHint: string;
  placeholder: string;
  rows: number;
};

function TextareaField({
  id,
  label,
  value,
  onChange,
  maxLength,
  limitHint,
  placeholder,
  rows,
}: TextareaFieldProps) {
  return (
    <div className={fieldShellClassName}>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <label htmlFor={id} className={fieldLabelClassName}>
          {label}
        </label>
        <LimitHint>{limitHint}</LimitHint>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={fieldControlClassName}
      />
      <span className={counterClass(value.length > maxLength)}>
        {value.length}/{maxLength}
      </span>
    </div>
  );
}

type TagsFieldProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

function TagsField({ tags, onChange }: TagsFieldProps) {
  const [draft, setDraft] = useState("");

  function handleAddTag() {
    const trimmed = draft.trim();
    if (!trimmed || tags.length >= MAX_TAGS) {
      return;
    }
    if (tags.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...tags, trimmed]);
    setDraft("");
  }

  function handleRemoveTag(tag: string) {
    onChange(tags.filter((item) => item !== tag));
  }

  return (
    <div className={fieldShellClassName}>
      <div className="flex min-w-0 items-start justify-between gap-4">
        <span className={fieldLabelClassName}>Tag:</span>
        <LimitHint>[facoltativo, max {MAX_TAGS}]</LimitHint>
      </div>
      <div className="flex min-w-0 flex-col gap-3 px-3 pb-3">
        <div className="flex min-w-0 gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddTag();
              }
            }}
            disabled={tags.length >= MAX_TAGS}
            placeholder="Aggiungi un tag"
            className={slotInputClassName}
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={tags.length >= MAX_TAGS || !draft.trim()}
            className="shrink-0 border border-fg-primary bg-bg-primary px-3 py-2 font-sans text-metadata uppercase leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Aggiungi
          </button>
        </div>
        {tags.length > 0 ? (
          <ul className="flex min-w-0 flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="inline-flex items-center gap-2 border border-fg-primary bg-bg-primary px-2.5 py-1 font-mono text-metadata uppercase leading-normal text-fg-primary"
                >
                  {tag}
                  <span aria-hidden>×</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <span className={counterClass(false)}>{tags.length}/{MAX_TAGS}</span>
      </div>
    </div>
  );
}

export default function StimulusPackWizard({
  conceptId: _conceptId,
}: StimulusPackWizardProps) {
  const [pack, setPack] = useState<StimulusPack>(initialPack);

  function updatePack<K extends keyof StimulusPack>(
    key: K,
    value: StimulusPack[K]
  ) {
    setPack((previous) => ({ ...previous, [key]: value }));
  }

  function handleSectorChange(event: ChangeEvent<HTMLSelectElement>) {
    updatePack("sector", event.target.value);
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-[890px] px-6 lg:px-0">
      <div className="flex w-full min-w-0 flex-col gap-8">
      <header className="flex min-w-0 flex-col gap-6">
        <h1 className="font-heading text-h1 font-bold uppercase text-fg-primary">
          Stimulus Pack
        </h1>
        <p className="max-w-prose font-sans text-body leading-relaxed text-fg-primary opacity-70">
          Più curi la presentazione, più forte sarà la percezione misurata. Il
          rispondente vedrà solo il materiale che compili qui sotto.
        </p>
      </header>

      <GallerySection
        images={pack.images}
        captions={pack.captions}
        onImagesChange={(images) => updatePack("images", images)}
        onCaptionsChange={(captions) => updatePack("captions", captions)}
      />

      <div className="border-t border-fg-primary" />

      <div className="flex min-w-0 flex-col gap-8 border border-fg-primary bg-bg-elevated px-6 py-8">
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          <div className={`relative ${metadataBadgeClassName}`}>
            <label
              htmlFor="sp-sector"
              className="font-mono text-metadata uppercase leading-normal text-fg-primary"
            >
              Settore
            </label>
            <span
              aria-hidden
              className="h-3 w-px shrink-0 bg-fg-primary"
            />
            <select
              id="sp-sector"
              value={pack.sector}
              onChange={handleSectorChange}
              className="min-w-0 appearance-none border-none bg-transparent pr-6 font-mono text-metadata uppercase leading-normal text-fg-primary outline-none"
            >
              <option value="">Seleziona…</option>
              {VALID_SECTORS.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
            <ChevronDownIcon />
          </div>
          <CompletionBar pack={pack} />
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <TextareaField
            id="sp-descrizione"
            label="Descrizione:"
            value={pack.descrizione}
            onChange={(value) => updatePack("descrizione", value)}
            maxLength={MAX_DESCRIPTION}
            limitHint="[≤350 caratteri]"
            placeholder="Spiega cos'è il concept e a cosa serve..."
            rows={7}
          />

          <TextareaField
            id="sp-contesto"
            label="Contesto e scenario d'uso:"
            value={pack.contesto_scenario}
            onChange={(value) => updatePack("contesto_scenario", value)}
            maxLength={MAX_CONTEXT}
            limitHint="[≤500 caratteri]"
            placeholder="Descrivi dove, quando e come viene usato il concept. Descrivi una situazione ipotetica di utilizzo del concept..."
            rows={10}
          />

          <TextareaField
            id="sp-target"
            label="Utente target:"
            value={pack.target_user}
            onChange={(value) => updatePack("target_user", value)}
            maxLength={MAX_TARGET}
            limitHint="[≤120 caratteri]"
            placeholder="Identifica o descrivi il target di persone a cui è destinato il concept..."
            rows={5}
          />

          <div className={fieldShellClassName}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <label htmlFor="sp-video" className={fieldLabelClassName}>
                Link video:
              </label>
              <LimitHint>[facoltativo]</LimitHint>
            </div>
            <input
              id="sp-video"
              type="url"
              value={pack.video_url}
              onChange={(event) => updatePack("video_url", event.target.value)}
              placeholder="https://..."
              className={`${fieldControlClassName} pb-4`}
            />
          </div>

          <TagsField
            tags={pack.tags}
            onChange={(tags) => updatePack("tags", tags)}
          />
        </div>
      </div>

      <div className="flex min-w-0 items-center justify-center gap-2 pb-4">
        <button
          type="button"
          aria-label="Indietro"
          className="flex size-5 items-center justify-center border border-fg-primary bg-bg-elevated"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          aria-label="Avanti"
          className="flex size-5 items-center justify-center border border-fg-primary bg-bg-elevated"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
      </div>
    </div>
  );
}
