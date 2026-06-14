"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { sanitizeFilename } from "@/src/lib/sanitize-filename";

const BUCKET = "concept-images";
const MAX_FILE_SIZE = 1024 * 1024;
const MAX_IMAGES = 5;

const labelClassName =
  "font-mono text-metadata uppercase leading-normal tracking-wide text-fg-primary";

const fieldClassName =
  "w-full border border-accent-tertiary bg-bg-elevated px-[14px] py-3 font-sans text-body leading-normal text-fg-primary outline-none transition-colors duration-150 ease-out focus:border-fg-primary disabled:cursor-not-allowed disabled:opacity-60";

const counterClassName =
  "font-sans text-metadata leading-normal text-fg-primary opacity-50";

type ImageUploaderProps = {
  conceptId: string;
  initialImages: string[];
  initialCaptions: Record<string, string>;
  readOnly?: boolean;
  onChange: (images: string[], captions: Record<string, string>) => void;
};

function extractStoragePath(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) {
    return null;
  }
  return publicUrl.slice(idx + marker.length);
}

function filenameFromUrl(url: string): string {
  const segment = url.split("/").pop();
  return segment || "immagine";
}

function buildUploadPath(conceptId: string, file: File): string {
  const lastDot = file.name.lastIndexOf(".");
  const ext = lastDot > 0 ? file.name.slice(lastDot + 1) : "jpg";
  const nameWithoutExt = lastDot > 0 ? file.name.slice(0, lastDot) : file.name;
  return `${conceptId}/${Date.now()}-${sanitizeFilename(nameWithoutExt)}.${sanitizeFilename(ext)}`;
}

function reindexCaptionsAfterRemove(
  captions: Record<string, string>,
  removedIndex: number
): Record<string, string> {
  const next: Record<string, string> = {};

  Object.entries(captions).forEach(([key, value]) => {
    const index = Number(key);
    if (Number.isNaN(index) || index === removedIndex) {
      return;
    }
    const newIndex = index > removedIndex ? index - 1 : index;
    next[String(newIndex)] = value;
  });

  return next;
}

export default function ImageUploader({
  conceptId,
  initialImages,
  initialCaptions,
  readOnly = false,
  onChange,
}: ImageUploaderProps) {
  const [images, setImages] = useState(initialImages);
  const [captions, setCaptions] = useState(initialCaptions);
  const [slotCount, setSlotCount] = useState(
    Math.max(1, initialImages.length)
  );
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [removeWarning, setRemoveWarning] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingSlotRef = useRef<number>(0);

  const isBusy = uploadingSlot !== null;

  function emitChange(
    nextImages: string[],
    nextCaptions: Record<string, string>
  ) {
    setImages(nextImages);
    setCaptions(nextCaptions);
    onChange(nextImages, nextCaptions);
  }

  function openFilePicker(slotIndex: number) {
    if (readOnly || isBusy) {
      return;
    }
    pendingSlotRef.current = slotIndex;
    setSlotError(null);
    fileInputRef.current?.click();
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const slotIndex = pendingSlotRef.current;

    if (!file.type.startsWith("image/")) {
      setSlotError("Seleziona un file immagine valido (JPEG, PNG, WebP, …).");
      return;
    }

    if (file.size >= MAX_FILE_SIZE) {
      setSlotError("Il file supera il limite di 1 MB.");
      return;
    }

    setSlotError(null);
    setRemoveWarning(null);
    setUploadingSlot(slotIndex);

    const supabase = createClient();
    const path = buildUploadPath(conceptId, file);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file);

    if (uploadError) {
      setSlotError("Impossibile caricare l'immagine. Riprova.");
      setUploadingSlot(null);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const nextImages = [...images];
    if (slotIndex === nextImages.length) {
      nextImages.push(publicUrl);
    } else {
      nextImages[slotIndex] = publicUrl;
    }

    emitChange(nextImages, captions);
    setUploadingSlot(null);
  }

  async function handleRemove(slotIndex: number) {
    if (readOnly || isBusy) {
      return;
    }

    const url = images[slotIndex];
    if (!url) {
      return;
    }

    setRemoveWarning(null);
    setSlotError(null);
    setUploadingSlot(slotIndex);

    const storagePath = extractStoragePath(url);
    if (storagePath) {
      const supabase = createClient();
      const { error } = await supabase.storage
        .from(BUCKET)
        .remove([storagePath]);

      if (error) {
        setRemoveWarning(
          "Impossibile eliminare il file dallo storage. L'immagine è stata rimossa dal concept."
        );
      }
    }

    const nextImages = images.filter((_, index) => index !== slotIndex);
    const nextCaptions = reindexCaptionsAfterRemove(captions, slotIndex);
    const nextSlotCount = nextImages.length === 0 ? 1 : nextImages.length;

    emitChange(nextImages, nextCaptions);
    setSlotCount(nextSlotCount);
    setUploadingSlot(null);
  }

  function handleCaptionChange(slotIndex: number, value: string) {
    if (readOnly) {
      return;
    }
    const nextCaptions = { ...captions, [String(slotIndex)]: value };
    emitChange(images, nextCaptions);
  }

  function handleAddSlot() {
    if (readOnly || isBusy || images.length >= MAX_IMAGES || slotCount >= MAX_IMAGES) {
      return;
    }
    setSlotCount((current) => Math.min(current + 1, MAX_IMAGES));
    setSlotError(null);
  }

  const showAddButton =
    !readOnly &&
    images.length < MAX_IMAGES &&
    slotCount < MAX_IMAGES &&
    images.length === slotCount &&
    !isBusy;

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
        disabled={isBusy}
      />

      <ul className="flex flex-col gap-3">
        {Array.from({ length: slotCount }, (_, slotIndex) => {
          const url = images[slotIndex];
          const isFilled = Boolean(url);
          const isUploadingThisSlot = uploadingSlot === slotIndex;
          const slotLabel =
            slotIndex === 0
              ? "Immagine principale (hero)"
              : `Immagine ${slotIndex + 1}`;

          if (!isFilled) {
            if (readOnly) {
              return null;
            }

            return (
              <li key={`slot-${slotIndex}`} className="flex flex-col gap-1.5">
                {slotIndex === 0 ? (
                  <span className={labelClassName}>{slotLabel}</span>
                ) : (
                  <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                    {slotLabel}
                  </span>
                )}
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => openFilePicker(slotIndex)}
                  className="flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-accent-tertiary bg-transparent px-4 py-6 font-sans text-body leading-normal text-fg-primary transition-opacity duration-150 ease-out hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploadingThisSlot ? (
                    <span className="opacity-70">Caricamento…</span>
                  ) : (
                    <span>Carica immagine</span>
                  )}
                </button>
              </li>
            );
          }

          return (
            <li
              key={`slot-${slotIndex}-${url}`}
              className="flex flex-col gap-2 border border-accent-tertiary bg-bg-elevated p-3"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-accent-tertiary bg-bg-primary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={captions[String(slotIndex)] || slotLabel}
                    className="h-[120px] w-[120px] shrink-0 object-cover"
                  />
                  {isUploadingThisSlot ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/80 font-sans text-metadata text-fg-primary">
                      …
                    </div>
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-sans text-metadata leading-normal text-fg-primary opacity-70">
                    {slotLabel}
                  </span>
                  <span className="truncate font-sans text-body leading-normal text-fg-primary">
                    {filenameFromUrl(url)}
                  </span>
                  {!readOnly ? (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleRemove(slotIndex)}
                      className="self-start font-sans text-metadata leading-normal text-fg-primary underline opacity-70 transition-opacity duration-150 ease-out hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Rimuovi
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`caption-${slotIndex}`}
                  className="font-sans text-metadata leading-normal text-fg-primary opacity-70"
                >
                  Didascalia (opzionale)
                </label>
                <input
                  id={`caption-${slotIndex}`}
                  type="text"
                  value={captions[String(slotIndex)] ?? ""}
                  disabled={isBusy || readOnly}
                  onChange={(event) =>
                    handleCaptionChange(slotIndex, event.target.value)
                  }
                  placeholder="Breve descrizione dell'immagine"
                  className={fieldClassName}
                />
                <span className={counterClassName}>
                  {(captions[String(slotIndex)] ?? "").length}/60
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {showAddButton ? (
        <button
          type="button"
          disabled={isBusy}
          onClick={handleAddSlot}
          className="self-start font-sans text-body leading-normal text-fg-primary underline opacity-70 transition-opacity duration-150 ease-out hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          + Aggiungi immagine
        </button>
      ) : null}

      {slotError ? (
        <p className="font-sans text-[13px] leading-normal text-fg-primary">
          {slotError}
        </p>
      ) : null}

      {removeWarning ? (
        <p className="font-sans text-[13px] leading-normal text-fg-primary opacity-70">
          {removeWarning}
        </p>
      ) : null}
    </div>
  );
}
