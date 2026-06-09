import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { logout } from "./header-actions";
import ProfileMenu from "./ProfileMenu";

const NAV_LINKS = [
  { label: "Archivio", href: "/archivio" },
  { label: "Framework", href: "/framework" },
] as const;

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
            prefetch={href === "/framework" ? false : undefined}
            className="flex h-[30px] items-center justify-center px-2 font-sans text-body text-fg-primary leading-[30px] whitespace-nowrap cursor-pointer transition-[box-shadow] duration-150 ease-out hover:shadow-[inset_0_0_0_1px_var(--color-fg-primary)] focus-visible:shadow-[inset_0_0_0_1px_var(--color-fg-primary)] focus-visible:outline-none"
          >
            {label}
          </Link>
        ))}

        {/* ── Profile dropdown ── */}
        <ProfileMenu
          userEmail={user?.email ?? null}
          logoutAction={logout}
        />

        {/* CTA — variante forte: viola → bianco */}
        <Link
          href="/analizza"
          prefetch={false}
          className="flex h-[30px] items-center justify-center px-2 font-sans text-body text-bg-elevated bg-accent-secondary border border-fg-primary leading-[30px] whitespace-nowrap cursor-pointer transition-colors duration-150 ease-out hover:bg-fg-primary hover:text-bg-elevated focus-visible:bg-fg-primary focus-visible:text-bg-elevated focus-visible:outline-none"
        >
          Analizza concept
        </Link>
      </nav>
    </header>
  );
}