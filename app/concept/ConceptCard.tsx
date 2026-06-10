import Link from "next/link";

export type UserConceptSummary = {
  id: string;
  title: string;
  sector: string;
  cfml_score: number | null;
  cfml_level: string | number | null;
  cfml_completed_at: string | null;
  created_at: string;
};

function formatCfmlLevel(level: string | number | null): string {
  if (level == null) return "";
  if (typeof level === "string") return level.startsWith("L") ? level : `L${level}`;
  return `L${level}`;
}

const metadataBoxClassName =
  "inline-flex items-center border border-accent-tertiary px-3 py-1 font-mono text-metadata uppercase leading-normal text-fg-primary";

export default function ConceptCard({ concept }: { concept: UserConceptSummary }) {
  const href = concept.cfml_completed_at
    ? `/concept/${concept.id}/cfml/results`
    : `/concept/${concept.id}/cfml`;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-6 border border-accent-tertiary bg-bg-elevated p-8 transition-colors duration-150 ease-out hover:bg-bg-primary"
    >
      <h2 className="font-sans text-display font-medium leading-normal text-fg-primary">
        {concept.title}
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        <span className={metadataBoxClassName}>{concept.sector}</span>

        {concept.cfml_completed_at ? (
          <>
            <span className={metadataBoxClassName}>
              {formatCfmlLevel(concept.cfml_level)}
            </span>
            <span className={metadataBoxClassName}>
              {concept.cfml_score != null
                ? `${concept.cfml_score.toFixed(1)}/100`
                : "—/100"}
            </span>
          </>
        ) : (
          <span
            className={`${metadataBoxClassName} bg-bg-primary`}
          >
            Bozza
          </span>
        )}
      </div>
    </Link>
  );
}
