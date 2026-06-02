import Link from "next/link";

const NAV_LINKS = [
  { label: "Atlas", href: "/atlas" },
  { label: "Framework", href: "/framework" },
  { label: "Profilo", href: "/profilo" },
  { label: "Analizza concept", href: "/analizza" },
] as const;

const CONTACT_LINKS = [
  { label: "research@innovationatlas.org", href: "mailto:research@innovationatlas.org" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Lorenzoromano121@gmail.com", href: "mailto:lorenzoromano121@gmail.com" },
] as const;

const LEGAL_LINKS = [
  { label: "Cookies policy", href: "/cookies" },
  { label: "Legal terms", href: "/legal" },
  { label: "Privacy policy", href: "/privacy" },
] as const;

export default function Footer() {
  return (
    <footer className="relative w-full h-[337px] bg-fg-primary shrink-0">

      {/* ── Main content row ── */}
      {/* Logo starts at 87px (6.04% × 1440); columns end 95px from right (6.6% × 1440) */}
      <div className="absolute left-[87px] right-[95px] top-[71px] flex items-start">

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-footer.svg" alt="Innovation Atlas" height={138} className="shrink-0" />

        {/* ── Three columns ── */}
        {/* ml-auto produces the 197px gap that matches the Figma layout */}
        <div className="ml-auto flex items-start">

          {/* Nav — uppercase + ← arrow */}
          <nav className="flex flex-col gap-6 text-right" aria-label="Footer navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-body text-bg-elevated uppercase whitespace-nowrap leading-none"
              >
                {label} ←
              </Link>
            ))}
          </nav>

          {/* Gap nav → contacts (95px) */}
          <div className="w-[95px] shrink-0" />

          {/* Contacts — ↗ arrow */}
          <div className="flex flex-col gap-6 text-right">
            {CONTACT_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-sans text-body text-bg-elevated whitespace-nowrap leading-none"
              >
                {label} ↗
              </a>
            ))}
          </div>

          {/* Gap contacts → legal (83px) */}
          <div className="w-[83px] shrink-0" />

          {/* Legal — no arrow */}
          <div className="flex flex-col gap-6 text-right">
            {LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-body text-bg-elevated whitespace-nowrap leading-none"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <p className="absolute bottom-[79px] right-[95px] font-mono text-metadata text-bg-elevated uppercase whitespace-nowrap leading-none">
        ©2026 LORENZO ROMANO
      </p>
    </footer>
  );
}
