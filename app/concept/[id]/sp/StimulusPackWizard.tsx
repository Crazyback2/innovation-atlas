"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Upload, X } from "lucide-react";
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
const MAX_IMAGES = 5;
const MIN_IMAGES = 3;
const MAX_FILE_SIZE = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);
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
  onImagesChange: (images: string[]) => void;
};

function isBlobUrl(url: string): boolean {
  return url.startsWith("blob:");
}

function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    return `"${file.name}": formato non supportato. Usa PNG, JPG o WebP.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return `"${file.name}" supera il limite di 1 MB.`;
  }
  return null;
}

function mockUploadFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(URL.createObjectURL(file));
    }, 400);
  });
}

type GalleryThumbnailProps = {
  url: string;
  index: number;
  isHero: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onRemove: () => void;
  onDragStart: (event: DragEvent<HTMLLIElement>) => void;
  onDragOver: (event: DragEvent<HTMLLIElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLLIElement>) => void;
  onDragEnd: () => void;
};

function GalleryThumbnail({
  url,
  index,
  isHero,
  isDragging,
  isDragOver,
  onRemove,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: GalleryThumbnailProps) {
  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`relative aspect-square min-w-0 cursor-grab overflow-hidden border border-fg-primary bg-bg-primary active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      } ${isDragOver ? "border-2 border-fg-primary" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="size-full object-cover" draggable={false} />

      {isHero ? (
        <span className="absolute top-2 left-2 border border-fg-primary bg-bg-elevated px-2 py-0.5 font-mono text-metadata uppercase leading-normal text-fg-primary">
          HERO
        </span>
      ) : null}

      <button
        type="button"
        aria-label={`Rimuovi immagine ${index + 1}`}
        onClick={onRemove}
        className="absolute top-2 right-2 flex size-7 items-center justify-center border border-fg-primary bg-bg-elevated text-fg-primary transition-opacity duration-150 ease-out hover:opacity-80"
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </li>
  );
}

function GallerySection({ images, onImagesChange }: GallerySectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const imageCount = images.length;
  const isAtMax = imageCount >= MAX_IMAGES;
  const isUploading = uploadingCount > 0;
  const dropzoneDisabled = isAtMax || isUploading;

  function revokeBlobUrl(url: string) {
    if (isBlobUrl(url)) {
      URL.revokeObjectURL(url);
    }
  }

  function handleRemove(index: number) {
    const url = images[index];
    if (!url) {
      return;
    }
    revokeBlobUrl(url);
    onImagesChange(images.filter((_, currentIndex) => currentIndex !== index));
    setGalleryError(null);
  }

  function reorderImages(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return;
    }
    const nextImages = [...images];
    const [moved] = nextImages.splice(fromIndex, 1);
    nextImages.splice(toIndex, 0, moved);
    onImagesChange(nextImages);
  }

  function handleDragStart(index: number, event: DragEvent<HTMLLIElement>) {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleDragOver(index: number, event: DragEvent<HTMLLIElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }

  function handleDrop(index: number, event: DragEvent<HTMLLIElement>) {
    event.preventDefault();
    if (dragIndex === null) {
      return;
    }
    reorderImages(dragIndex, index);
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  async function processFiles(files: File[]) {
    if (files.length === 0) {
      return;
    }

    setGalleryError(null);

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      setGalleryError(`Puoi caricare al massimo ${MAX_IMAGES} immagini.`);
      return;
    }

    const validationErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of files) {
      if (validFiles.length >= remainingSlots) {
        validationErrors.push(
          `Solo ${remainingSlots} immagini aggiuntive consentite (max ${MAX_IMAGES}).`
        );
        break;
      }

      const validationError = validateImageFile(file);
      if (validationError) {
        validationErrors.push(validationError);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      setGalleryError(validationErrors.join(" "));
      return;
    }

    setUploadingCount((current) => current + validFiles.length);

    const uploadedUrls: string[] = [];
    const uploadErrors: string[] = [...validationErrors];

    for (const file of validFiles) {
      try {
        const mockUrl = await mockUploadFile(file);
        uploadedUrls.push(mockUrl);
      } catch {
        uploadErrors.push(`Impossibile caricare "${file.name}". Riprova.`);
      } finally {
        setUploadingCount((current) => Math.max(0, current - 1));
      }
    }

    if (uploadedUrls.length > 0) {
      onImagesChange([...images, ...uploadedUrls]);
    }

    if (uploadErrors.length > 0) {
      setGalleryError(uploadErrors.join(" "));
    }
  }

  function handleFiles(fileList: FileList | null | undefined) {
    if (!fileList?.length) {
      return;
    }
    void processFiles(Array.from(fileList));
  }

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
    event.target.value = "";
  }

  function handleDropzoneClick() {
    if (dropzoneDisabled) {
      return;
    }
    fileInputRef.current?.click();
  }

  function handleDropzoneDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (dropzoneDisabled) {
      return;
    }
    setIsDropzoneActive(true);
  }

  function handleDropzoneDragLeave() {
    setIsDropzoneActive(false);
  }

  function handleDropzoneDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDropzoneActive(false);
    if (dropzoneDisabled) {
      return;
    }
    handleFiles(event.dataTransfer.files);
  }

  return (
    <section className="flex w-full min-w-0 max-w-full flex-col gap-6">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <h2 className="font-sans text-display-caps uppercase leading-none text-fg-primary">
          Galleria
        </h2>
        <span className={counterClassName}>
          {imageCount}/{MAX_IMAGES}
        </span>
      </div>

      <div className="border-t border-fg-primary" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={dropzoneDisabled}
        onChange={handleFileInputChange}
      />

      <button
        type="button"
        disabled={dropzoneDisabled}
        onClick={handleDropzoneClick}
        onDragOver={handleDropzoneDragOver}
        onDragLeave={handleDropzoneDragLeave}
        onDrop={handleDropzoneDrop}
        className={`flex min-h-40 w-full min-w-0 max-w-full flex-col items-center justify-center gap-3 border border-dashed border-fg-primary bg-bg-elevated px-6 py-8 transition-colors duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-40 ${
          isDropzoneActive ? "border-fg-primary bg-bg-primary" : ""
        }`}
      >
        <Upload
          aria-hidden
          className="size-8 text-fg-primary opacity-70"
          strokeWidth={1.25}
        />
        <span className="font-sans text-body font-bold uppercase leading-normal text-fg-primary">
          {isUploading
            ? "Caricamento in corso…"
            : "Clicca per caricare o trascina"}
        </span>
        <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
          PNG, JPG, WebP · max 1MB
        </span>
        {imageCount < MIN_IMAGES ? (
          <span className="font-sans text-metadata leading-normal text-fg-primary opacity-50">
            Minimo {MIN_IMAGES} immagini richieste
          </span>
        ) : null}
      </button>

      {galleryError ? (
        <p className="font-sans text-metadata leading-normal text-error">
          {galleryError}
        </p>
      ) : null}

      {images.length > 0 ? (
        <ul className="grid w-full min-w-0 max-w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-[repeat(5,minmax(0,1fr))]">
          {images.map((url, index) => (
            <GalleryThumbnail
              key={url}
              url={url}
              index={index}
              isHero={index === 0}
              isDragging={dragIndex === index}
              isDragOver={dragOverIndex === index && dragIndex !== index}
              onRemove={() => handleRemove(index)}
              onDragStart={(event) => handleDragStart(index, event)}
              onDragOver={(event) => handleDragOver(index, event)}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(event) => handleDrop(index, event)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </ul>
      ) : null}
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
        <LimitHint>{`[facoltativo, max ${MAX_TAGS}]`}</LimitHint>
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
        onImagesChange={(images) => updatePack("images", images)}
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
  );
}
