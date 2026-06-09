import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-sans">
      <Header />

      <main className="flex-1">
        <section className="relative min-h-[800px] w-full overflow-hidden bg-fg-primary">
          {/* Background SVG — scaled up, anchored right */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/background_error404.svg"
              alt=""
              className="absolute right-0 top-0 h-full w-full origin-top-right scale-[1.45] object-cover"
            />
          </div>

          {/* Content frame — 1440px, desktop only */}
          <div className="relative mx-auto min-h-[800px] w-[1440px]">
            {/* Left column — vertically centered, shifted +20px */}
            <div className="absolute left-[108px] top-[calc(50%+20px)] flex -translate-y-1/2 flex-col items-start">
              <p className="mb-2 font-mono text-metadata leading-normal text-bg-elevated">
                {'// 404 "WHAT IS GOING ON?"'}
              </p>

              <div className="border border-fg-primary bg-bg-elevated px-8 py-4">
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

            {/* Right label — aligned with ERROR 404 box center, shifted +20px */}
            <p className="absolute right-[96px] top-[calc(50%+10px)] -translate-y-1/2 font-mono text-metadata uppercase leading-normal text-bg-elevated">
              WE&apos;RE OFF THE CHART
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
