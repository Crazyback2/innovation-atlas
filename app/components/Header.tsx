import Link from "next/link";

const NAV_LINKS = [
  { label: "Archivio", href: "/archivio" },
  { label: "Framework", href: "/framework" },
  { label: "Profilo", href: "/profilo" },
] as const;

export default function Header() {
  return (
    <header className="flex items-center justify-between h-[69px] w-full bg-bg-elevated px-8 shrink-0">
      {/* ── Logo + Wordmark ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-header.svg" alt="Innovation Atlas" height={39} />

      {/* ── Nav + CTA ── */}
      <nav className="flex items-center gap-10" aria-label="Navigazione principale">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            // box-shadow inset: nessun impatto sul box-model, lo spazio del bordo
            // non è mai riservato nella struttura → zero layout shift
            className="flex h-[30px] items-center justify-center px-2 font-sans text-body text-fg-primary leading-[30px] whitespace-nowrap cursor-pointer transition-[box-shadow] duration-150 ease-out hover:shadow-[inset_0_0_0_1px_var(--color-fg-primary)] focus-visible:shadow-[inset_0_0_0_1px_var(--color-fg-primary)] focus-visible:outline-none"
          >
            {label}
          </Link>
        ))}

        {/* CTA — variante forte: viola → bianco */}
        <Link
          href="/analizza"
          className="flex h-[30px] items-center justify-center px-2 font-sans text-body text-bg-elevated bg-accent-secondary border border-fg-primary leading-[30px] whitespace-nowrap cursor-pointer transition-colors duration-150 ease-out hover:bg-fg-primary hover:text-bg-elevated focus-visible:bg-fg-primary focus-visible:text-bg-elevated focus-visible:outline-none"
        >
          Analizza concept
        </Link>
      </nav>
    </header>
  );
}
