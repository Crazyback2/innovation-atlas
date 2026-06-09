import Link from "next/link";

export type UserConceptSummary = {
  id: string;
  title: string;
  sector: string;
  cfml_score: number | null;
  cfml_level: string | number | null;
  created_at: string;
};

function formatCfmlLevel(level: string | number | null): string {
  if (level == null) return "";
  if (typeof level === "string") return level.startsWith("L") ? level : `L${level}`;
  return `L${level}`;
}

export default function ConceptCard({ concept }: { concept: UserConceptSummary }) {
  const hasScore = concept.cfml_score != null;

  return (
    <Link
      href={`/concept/${concept.id}`}
      className="group flex flex-col gap-6 border border-accent-tertiary bg-bg-elevated p-8 transition-colors duration-150 ease-out hover:border-fg-primary"
    >
      <h2 className="font-sans text-display font-medium leading-normal text-fg-primary">
        {concept.title}
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center border border-accent-tertiary px-3 py-1 font-mono text-metadata uppercase leading-normal text-fg-primary">
          {concept.sector}
        </span>

        {hasScore ? (
          <span className="font-mono text-metadata leading-normal text-fg-primary">
            CFML {concept.cfml_score}
            {concept.cfml_level != null && (
              <>
                {" "}
                · {formatCfmlLevel(concept.cfml_level)}
              </>
            )}
          </span>
        ) : (
          <span className="inline-flex items-center border border-accent-tertiary bg-bg-primary px-3 py-1 font-mono text-metadata uppercase leading-normal text-fg-primary">
            Bozza
          </span>
        )}
      </div>
    </Link>
  );
}
