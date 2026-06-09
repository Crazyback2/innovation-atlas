"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createConcept } from "./actions";
import { VALID_SECTORS } from "./data";

const labelClassName =
  "font-mono text-metadata uppercase leading-normal tracking-wide text-fg-primary";

const fieldClassName =
  "w-full border border-accent-tertiary bg-bg-elevated px-[14px] py-3 font-sans text-body leading-normal text-fg-primary outline-none transition-colors duration-150 ease-out focus:border-fg-primary";

export default function NewConceptForm() {
  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
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

    const result = await createConcept(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className={labelClassName}>
          Titolo del concept
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Es. Piattaforma per la mobilità urbana"
          className={fieldClassName}
        />
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
          maxLength={600}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Cosa è e a cosa serve, in poche righe."
          className={`${fieldClassName} resize-y`}
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
        {isSubmitting ? "Creazione in corso…" : "Crea concept"}
      </button>

      <Link
        href="/concept"
        className="mt-2 text-center font-sans text-body leading-normal text-fg-primary underline opacity-70 transition-opacity duration-150 ease-out hover:opacity-100"
      >
        Annulla
      </Link>
    </form>
  );
}
