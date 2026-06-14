"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSPSurvey } from "@/app/concept/[id]/sp/actions";

export default function CreateSPSurveyConfirm({
  conceptId,
}: {
  conceptId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);

    try {
      await createSPSurvey({ conceptId });
      router.push(`/concept/${conceptId}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossibile creare la SP survey. Riprova più tardi."
      );
      setLoading(false);
    }
  }

  return (
    <div className="mt-12 flex flex-col gap-4">
      {error ? (
        <div className="border border-accent-tertiary bg-bg-primary px-3 py-2.5 font-sans text-[13px] leading-normal text-fg-primary">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleCreate}
        disabled={loading}
        className="cursor-pointer border-none bg-fg-primary px-6 py-[14px] font-sans text-body font-medium leading-normal text-bg-primary transition-opacity duration-150 ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creazione in corso…" : "Crea survey ora"}
      </button>

      <Link
        href={`/concept/${conceptId}`}
        className="text-center font-sans text-body leading-normal text-fg-primary underline opacity-70 transition-opacity duration-150 ease-out hover:opacity-100"
      >
        Annulla
      </Link>
    </div>
  );
}
