"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteConcept } from "@/app/concept/[id]/actions";

const destructiveButtonClassName =
  "inline-flex cursor-pointer items-center justify-center border border-error bg-transparent px-6 py-3.5 font-sans text-body font-medium leading-normal text-error transition-opacity duration-150 ease-out hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";

export default function DeleteConceptButton({
  conceptId,
  conceptTitle,
}: {
  conceptId: string;
  conceptTitle: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Cancellare il concept «${conceptTitle}»? Verranno eliminate definitivamente anche survey, risposte e immagini collegate. Questa azione non è reversibile.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      await deleteConcept(conceptId);
      router.push("/concept");
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Impossibile cancellare il concept. Riprova più tardi."
      );
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className={destructiveButtonClassName}
    >
      {loading ? "Cancellazione…" : "Cancella concept"}
    </button>
  );
}
