import { redirect } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { createClient } from "@/src/lib/supabase/server";
import NewConceptForm from "./NewConceptForm";

export const metadata = {
  title: "Nuovo concept — Innovation Atlas",
};

export default async function NewConceptPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary font-sans">
      <Header />

      <main className="flex-1 py-[var(--spacing-section)]">
        <div className="mx-auto w-full max-w-2xl px-[var(--spacing-gutter)]">
          <h1 className="font-sans text-display font-medium leading-normal text-fg-primary">
            Nuovo concept
          </h1>
          <p className="mt-2 font-heading text-body leading-normal text-fg-primary opacity-70">
            Inserisci i dati base. Potrai compilare CFML e SP dalla pagina del
            concept.
          </p>

          <div className="mt-10">
            <NewConceptForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
