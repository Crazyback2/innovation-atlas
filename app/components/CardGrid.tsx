"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Concept } from "@/src/data/concepts";
import { isPlaceholderConcept } from "@/src/data/concepts";

const PAGE_SIZE = 20;
export const CONCEPT_CARD_GRID_W = 4 * 248 + 3 * 24; // 1064
const GRID_W = CONCEPT_CARD_GRID_W;

export type ArchiveConceptCardData = {
  id: string;
  title: string;
  author: { name: string };
  images: string[];
  sp: number | null;
  cfml: number | null;
};

function formatCardScore(value: number | null | undefined): string {
  return value == null ? "-" : String(value);
}

function ConceptCardImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="h-[180px] w-full bg-accent-tertiary" aria-hidden="true" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="h-[180px] w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export function ArchiveConceptCard({
  concept,
  editable = false,
  detailBase = "concept",
}: {
  concept: ArchiveConceptCardData;
  editable?: boolean;
  detailBase?: "concept" | "archivio";
}) {
  const imageSrc = concept.images[0] ?? "/concepts/placeholder.jpg";

  // Solo nella griglia /archivio i concept dimostrativi mostrano "Placeholder"
  // al posto del nome autore inventato. La dashboard (detailBase="concept")
  // elenca concept reali dell'utente e non è interessata.
  const isDemo = detailBase === "archivio" && isPlaceholderConcept(concept);
  const authorName = isDemo ? "Placeholder" : concept.author.name;

  return (
    <Link
      href={`/${detailBase}/${concept.id}`}
      className="relative group block w-[248px] shrink-0"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-fg-primary transition-transform duration-150 ease-out group-hover:translate-x-[1px] group-hover:translate-y-[1px]"
      />

      <div className="relative border border-fg-primary bg-bg-elevated transition-transform duration-150 ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]">
        {editable && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-[13px] top-[13px] z-10 flex size-8 items-center justify-center border border-fg-primary bg-bg-elevated opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          >
            <Pencil className="size-4 text-fg-primary" strokeWidth={1.5} />
          </span>
        )}
        <div className="border-b border-fg-primary">
          <ConceptCardImage src={imageSrc} alt={concept.title} />
        </div>
        <div className="h-[68px] px-[13px] py-[9px] flex gap-x-[6px]">
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="font-mono text-metadata text-fg-primary leading-normal truncate">
              Project: {concept.title}
            </span>
            <span className="font-mono text-metadata text-fg-primary leading-normal">
              Author:
            </span>
            <span className="font-mono text-metadata text-fg-primary leading-normal truncate">
              {authorName}
            </span>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="font-mono font-bold text-metadata text-fg-primary leading-normal select-none">
              &nbsp;
            </span>
            <span className="font-mono font-bold text-metadata text-fg-primary leading-normal whitespace-nowrap">
              {formatCardScore(concept.sp)} SP
            </span>
            <span className="font-mono font-bold text-metadata text-fg-primary leading-normal whitespace-nowrap">
              {formatCardScore(concept.cfml)} CFML
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface Props {
  concepts: Concept[];
  filterKey?: string;
}

export default function CardGrid({ concepts, filterKey }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(concepts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageConcepts = concepts.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterKey]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function goToPage(page: number) {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const atFirst = safePage <= 1;
  const atLast = safePage >= totalPages;

  const navBtnClass =
    "size-[29px] flex items-center justify-center border border-fg-primary bg-bg-elevated font-mono text-metadata text-fg-primary leading-none transition-colors duration-150 ease-out";

  return (
    <section className="w-full bg-bg-primary">
      <div className="mx-auto w-[1440px] flex flex-col items-center pt-[64px] pb-[120px]">
        <div ref={gridRef} className="grid grid-cols-4 gap-[24px]" style={{ width: GRID_W }}>
          {pageConcepts.map((concept) => (
            <ArchiveConceptCard
              key={concept.id}
              detailBase="archivio"
              concept={{
                id: concept.id,
                title: concept.title,
                author: concept.author,
                images: concept.images,
                sp: concept.sp,
                cfml: concept.cfml,
              }}
            />
          ))}
        </div>

        <div
          className="mt-[24px] flex items-center justify-between"
          style={{ width: GRID_W }}
        >
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              aria-label="Pagina precedente"
              disabled={atFirst}
              onClick={() => !atFirst && goToPage(safePage - 1)}
              className={`${navBtnClass} ${
                atFirst
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:bg-accent-secondary hover:text-bg-elevated"
              }`}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Pagina successiva"
              disabled={atLast}
              onClick={() => !atLast && goToPage(safePage + 1)}
              className={`${navBtnClass} ${
                atLast
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:bg-accent-secondary hover:text-bg-elevated"
              }`}
            >
              →
            </button>
          </div>

          <p className="font-mono text-metadata text-fg-primary leading-normal">
            Pagina {safePage} di {totalPages}
          </p>
        </div>
      </div>
    </section>
  );
}
