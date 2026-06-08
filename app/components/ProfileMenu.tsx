'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Props = {
  userEmail: string | null;
  logoutAction: () => Promise<void>;
};

export default function ProfileMenu({ userEmail, logoutAction }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Chiudi cliccando fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Chiudi con ESC
  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-[30px] items-center justify-center px-2 font-sans text-body text-fg-primary leading-[30px] whitespace-nowrap cursor-pointer transition-[box-shadow] duration-150 ease-out hover:shadow-[inset_0_0_0_1px_var(--color-fg-primary)] focus-visible:shadow-[inset_0_0_0_1px_var(--color-fg-primary)] focus-visible:outline-none"
      >
        Profilo
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] min-w-[220px] bg-bg-elevated border border-fg-primary z-50"
        >
          {userEmail ? (
            <>
              <div
  className="px-4 py-3 font-mono text-metadata text-fg-primary opacity-70 uppercase tracking-wide border-b border-tertiary truncate"
>
  {userEmail}
</div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="block w-full text-left px-4 py-3 font-sans text-body text-fg-primary cursor-pointer hover:bg-bg-primary transition-colors duration-150 ease-out"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full px-4 py-3 font-sans text-body text-fg-primary cursor-pointer hover:bg-bg-primary transition-colors duration-150 ease-out border-b border-tertiary"
              >
                Accedi
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block w-full px-4 py-3 font-sans text-body text-fg-primary cursor-pointer hover:bg-bg-primary transition-colors duration-150 ease-out"
              >
                Registrati
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}