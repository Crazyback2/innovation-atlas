import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-fg-primary">
      {/* Background SVG — full viewport */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/background_error404.svg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Content frame — 1440px, desktop only */}
      <div className="relative mx-auto h-full w-[1440px]">
        {/* Left column — vertically centered */}
        <div className="absolute left-[108px] top-1/2 flex -translate-y-1/2 flex-col items-start">
          <p className="mb-2 font-mono text-metadata leading-normal text-bg-elevated">
            {'// 404 "WHAT IS GOING ON?"'}
          </p>

          <div className="bg-bg-elevated px-8 py-4">
            <h1 className="font-heading text-h1 font-bold leading-[60px] text-fg-primary whitespace-nowrap">
              ERROR 404
            </h1>
          </div>

          <Link
            href="/"
            className="mt-2 flex items-center justify-center bg-bg-elevated px-4 py-[10px] font-mono text-metadata uppercase leading-normal text-fg-primary cursor-pointer transition-colors duration-150 ease-out hover:bg-accent-primary"
          >
            HOMEPAGE?
          </Link>
        </div>

        {/* Right label — vertically aligned with ERROR 404 box center */}
        <p className="absolute right-[96px] top-[calc(50%-10px)] -translate-y-1/2 font-mono text-metadata uppercase leading-normal text-bg-elevated">
          WE&apos;RE OFF THE CHART
        </p>
      </div>
    </div>
  );
}
