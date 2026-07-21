"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

const CLOSE_BTN =
  "size-[29px] flex items-center justify-center border border-fg-primary bg-bg-elevated font-mono text-metadata text-fg-primary leading-none transition-colors duration-150 ease-out cursor-pointer hover:bg-accent-primary";

type OverlayLightboxProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** Optional chrome (es. controlli gallery). */
  footer?: ReactNode;
  /** Classi sul wrapper del contenuto (default adatto al pack). */
  contentClassName?: string;
};

/**
 * Overlay fullscreen condiviso (concept hero / pack SP):
 * sfondo sfocato, chiudi con X / click fuori / Esc.
 */
export default function OverlayLightbox({
  open,
  onClose,
  label,
  children,
  footer,
  contentClassName = "max-h-[90vh] max-w-[min(1160px,92vw)] overflow-auto",
}: OverlayLightboxProps) {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-elevated/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Chiudi"
        onClick={onClose}
        className={`${CLOSE_BTN} absolute top-8 left-8`}
      >
        <X className="size-3.5" strokeWidth={1.5} />
      </button>

      <div
        className={contentClassName}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>

      {footer}
    </div>
  );
}
