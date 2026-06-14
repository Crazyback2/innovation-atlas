"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteSurvey } from "@/app/concept/[id]/sp/actions";

const actionLinkClassName =
  "font-sans text-body font-medium leading-normal text-accent-primary";

export default function DeleteSurveyButton({
  surveyId,
  responsesCount,
}: {
  surveyId: string;
  responsesCount: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Cancellare questa survey? Le ${responsesCount} risposte raccolte verranno eliminate definitivamente. Questa azione non è reversibile.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      await deleteSurvey(surveyId);
      router.refresh();
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Impossibile cancellare la survey. Riprova più tardi."
      );
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className={`${actionLinkClassName} cursor-pointer border-none bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading ? "Cancellazione…" : "Cancella"}
    </button>
  );
}
