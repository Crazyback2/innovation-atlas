const NAV_CONTROL_CLASS =
  "flex size-[29px] items-center justify-center border border-fg-primary bg-bg-elevated font-mono text-metadata leading-none text-fg-primary";

function GalleryImage({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`border border-fg-primary bg-accent-tertiary ${className}`}
    />
  );
}

function ImagePlaceholderSlot() {
  return (
    <div className="absolute left-[807px] top-[74px] flex h-[197px] w-[174px] flex-col items-center justify-center border border-dashed border-fg-primary bg-bg-primary px-2 text-center font-sans text-body font-bold uppercase leading-normal text-fg-primary">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-fg-primary"
        viewBox="0 0 174 197"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0"
          y1="0"
          x2="174"
          y2="197"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="174"
          y1="0"
          x2="0"
          y2="197"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
      <span>inserisci</span>
      <span>immagine</span>
      <span>3/5</span>
    </div>
  );
}

export default function ConceptDetailGallery() {
  return (
    <section className="flex flex-col">
      <header>
        <h2 className="font-sans text-display uppercase leading-[60px] text-fg-primary">
          Gallery{" "}
          <span className="text-body normal-case">
            [1 immagine hero + 2 obbligatorie, limite 5]
          </span>
        </h2>
        <div className="border-t border-dashed border-fg-primary" />
      </header>

      <div className="relative mt-6 h-[407px]">
        <GalleryImage className="absolute left-0 top-[19px] size-[401px]" />
        <GalleryImage className="absolute left-[159px] top-0 z-10 size-[362px]" />
        <GalleryImage className="absolute left-[318px] top-[19px] z-20 size-[323px]" />
        <GalleryImage className="absolute left-[475px] top-[38px] z-30 size-[286px]" />
        <ImagePlaceholderSlot />
      </div>

      <div className="mt-[8px] flex items-center gap-[8px]">
        <div className={NAV_CONTROL_CLASS} aria-hidden="true">
          ←
        </div>
        <div className={NAV_CONTROL_CLASS} aria-hidden="true">
          →
        </div>
      </div>
    </section>
  );
}
