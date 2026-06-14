"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { VALID_SECTORS } from "@/app/concept/new/data";
import ImageUploader from "./ImageUploader";
import { updateConcept } from "./actions";

const labelClassName =
  "font-mono text-metadata uppercase leading-normal tracking-wide text-fg-primary";

const fieldClassName =
  "w-full border border-accent-tertiary bg-bg-elevated px-[14px] py-3 font-sans text-body leading-normal text-fg-primary outline-none transition-colors duration-150 ease-out focus:border-fg-primary disabled:cursor-not-allowed disabled:opacity-60";

const counterClassName =
  "font-sans text-metadata leading-normal text-fg-primary opacity-50";

type EditConceptFormProps = {
  conceptId: string;
  packLocked: boolean;
  initialTitle: string;
  initialSector: string;
  initialDescription: string;
  initialContextScenario: string;
  initialTargetUser: string;
  initialImages: string[];
  initialCaptions: Record<string, string>;
  initialVideoUrl: string;
};

export default function EditConceptForm({
  conceptId,
  packLocked,
  initialTitle,
  initialSector,
  initialDescription,
  initialContextScenario,
  initialTargetUser,
  initialImages,
  initialCaptions,
  initialVideoUrl,
}: EditConceptFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [sector, setSector] = useState(initialSector);
  const [description, setDescription] = useState(initialDescription);
  const [contextScenario, setContextScenario] = useState(initialContextScenario);
  const [targetUser, setTargetUser] = useState(initialTargetUser);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [images, setImages] = useState(initialImages);
  const [captions, setCaptions] = useState(initialCaptions);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("sector", sector);
    formData.set("description", description);
    formData.set("context_scenario", contextScenario);
    formData.set("target_user", targetUser);
    formData.set("video_url", videoUrl);
    formData.set("images", JSON.stringify(images));
    formData.set("image_captions", JSON.stringify(captions));

    const result = await updateConcept(conceptId, formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {packLocked ? (
        <div className="bg-accent-tertiary px-6 py-5 font-sans text-body leading-relaxed text-fg-primary">
          <span className="font-medium">Stimulus pack bloccato</span>
          {" — "}
          Questo concept ha una o più survey SP attive. Per modificare il pack,
          vai sulla detail del concept e cancella tutte le survey, oppure crea
          un nuovo concept. Titolo e settore restano modificabili.
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClassName}>
          Titolo del concept
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Es. Piattaforma per la mobilità urbana"
          className={fieldClassName}
        />
        <span className={counterClassName}>{title.length}/60</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sector" className={labelClassName}>
          Settore
        </label>
        <select
          id="sector"
          name="sector"
          required
          value={sector}
          onChange={(event) => setSector(event.target.value)}
          className={fieldClassName}
        >
          <option value="" disabled>
            Seleziona un settore
          </option>
          {VALID_SECTORS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className={labelClassName}>
          Descrizione (opzionale)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          disabled={packLocked}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Cosa è e a cosa serve, in poche righe."
          className={`${fieldClassName} resize-y`}
        />
        <span className={counterClassName}>{description.length}/350</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="context_scenario" className={labelClassName}>
          Contesto / scenario d&apos;uso (opzionale)
        </label>
        <textarea
          id="context_scenario"
          name="context_scenario"
          rows={4}
          value={contextScenario}
          disabled={packLocked}
          onChange={(event) => setContextScenario(event.target.value)}
          placeholder="In quale situazione viene usato? Descrivi il contesto d'uso."
          className={`${fieldClassName} resize-y`}
        />
        <span className={counterClassName}>{contextScenario.length}/500</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="target_user" className={labelClassName}>
          Utente target (opzionale)
        </label>
        <input
          id="target_user"
          name="target_user"
          type="text"
          value={targetUser}
          disabled={packLocked}
          onChange={(event) => setTargetUser(event.target.value)}
          placeholder="Es. Professionisti urbani 25-40 anni"
          className={fieldClassName}
        />
        <span className={counterClassName}>{targetUser.length}/120</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={labelClassName}>Immagini (opzionale)</span>
        <ImageUploader
          conceptId={conceptId}
          initialImages={initialImages}
          initialCaptions={initialCaptions}
          readOnly={packLocked}
          onChange={(nextImages, nextCaptions) => {
            setImages(nextImages);
            setCaptions(nextCaptions);
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="video_url" className={labelClassName}>
          Video URL (opzionale)
        </label>
        <input
          id="video_url"
          name="video_url"
          type="text"
          value={videoUrl}
          disabled={packLocked}
          onChange={(event) => setVideoUrl(event.target.value)}
          placeholder="https://..."
          className={fieldClassName}
        />
      </div>

      {error && (
        <div className="border border-accent-tertiary bg-bg-primary px-3 py-2.5 font-sans text-[13px] leading-normal text-fg-primary">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full cursor-pointer border-none bg-fg-primary px-4 py-[14px] font-sans text-body font-medium leading-normal text-bg-primary transition-opacity duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Salvataggio in corso…" : "Salva modifiche"}
      </button>

      <Link
        href={`/concept/${conceptId}`}
        className="mt-2 text-center font-sans text-body leading-normal text-fg-primary underline opacity-70 transition-opacity duration-150 ease-out hover:opacity-100"
      >
        Annulla
      </Link>
    </form>
  );
}
