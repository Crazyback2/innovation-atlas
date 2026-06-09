import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/src/lib/supabase/server";
import ConceptCard, { type UserConceptSummary } from "./ConceptCard";

export const metadata = {
  title: "I miei concept — Innovation Atlas",
};

const newConceptLinkClassName =
  "inline-flex items-center justify-center border border-fg-primary bg-accent-secondary px-6 py-3 font-sans text-body font-medium leading-normal text-bg-elevated transition-colors duration-150 ease-out hover:bg-fg-primary";

export default async function MyConceptsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: concepts } = await supabase
    .from("concepts")
    .select("id, title, sector, cfml_score, cfml_level, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const userConcepts = (concepts ?? []) as UserConceptSummary[];
  const isEmpty = userConcepts.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main
        className={
          isEmpty
            ? "flex flex-1 items-center justify-center"
            : "flex-1 py-[var(--spacing-section)]"
        }
      >
        {isEmpty ? (
          <div className="mx-auto flex w-full max-w-[var(--container-page)] flex-col items-center px-[var(--spacing-gutter)] text-center">
            <h1 className="font-sans text-display font-medium leading-normal text-fg-primary">
              Non hai ancora valutato nessun concept
            </h1>
            <p className="mt-4 max-w-[520px] font-heading text-lead leading-normal text-fg-primary opacity-70">
              Crea il tuo primo concept per iniziare a usarlo con la CFML e la SP.
            </p>
            <Link
              href="/concept/new"
              className={`mt-10 px-8 py-4 font-sans text-lead font-medium leading-normal ${newConceptLinkClassName}`}
            >
              + Crea il tuo primo concept
            </Link>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[var(--container-page)] px-[var(--spacing-gutter)]">
            <div className="mb-12 flex items-start justify-between gap-8">
              <div>
                <h1 className="font-sans text-display font-medium leading-normal text-fg-primary">
                  I miei concept
                </h1>
                <p className="mt-2 font-mono text-metadata uppercase leading-normal text-fg-primary opacity-70">
                  {userConcepts.length} concept
                </p>
              </div>

              <Link href="/concept/new" className={newConceptLinkClassName}>
                + Nuovo concept
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {userConcepts.map((concept) => (
                <ConceptCard key={concept.id} concept={concept} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
