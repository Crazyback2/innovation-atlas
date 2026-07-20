import Header from "./components/Header";
import Hero from "./components/Hero";
import LinearTheory from "./components/LinearTheory";
import Matrix from "./components/Matrix";
import AtlasPreview from "./components/AtlasPreview";
import AtlasCta from "./components/AtlasCta";
import Footer from "./components/Footer";

// AtlasPreview mostra le hero image reali (dal DB) dei 3 concept pubblici,
// come /archivio: dati live → niente cache statica.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-sans">
      <Header />
      <main className="flex-1">
        <Hero />
        <LinearTheory />
        <Matrix />
        <AtlasPreview />
        <AtlasCta />
      </main>
      <Footer />
    </div>
  );
}
