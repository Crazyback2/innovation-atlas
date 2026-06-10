"use client";

import Link from "next/link";
import { useState } from "react";
import { createSPSurvey } from "@/app/concept/[id]/sp/actions";

type CreateSPSurveyResult = {
  id: string;
  publicToken: string;
};

export default function CreateSPSurveyButton({
  conceptId,
}: {
  conceptId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateSPSurveyResult | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const created = await createSPSurvey({ conceptId });
      setResult(created);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossibile creare la SP survey. Riprova più tardi."
      );
    } finally {
      setLoading(false);
    }
  }

  const surveyUrl =
    result && typeof window !== "undefined"
      ? `${window.location.origin}/sp/${result.publicToken}`
      : null;

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="bg-fg-primary px-6 py-[14px] font-sans text-body font-medium leading-normal text-bg-primary transition-opacity duration-150 ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creazione in corso…" : "Crea SP survey"}
      </button>

      {error && (
        <p className="font-sans text-body leading-normal text-red-600">
          {error}
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-2 font-sans text-body leading-normal text-fg-primary">
          <p>
            Token:{" "}
            <span className="font-mono text-metadata">{result.publicToken}</span>
          </p>
          {surveyUrl && (
            <p>
              Link:{" "}
              <a
                href={surveyUrl}
                className="font-mono text-metadata underline underline-offset-2"
              >
                {surveyUrl}
              </a>
            </p>
          )}
          <p>
            <Link
              href={`/concept/${conceptId}/sp/results`}
              className="text-accent-primary underline underline-offset-2"
            >
              Vai ai risultati SP
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
