import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-sans">
      <Header />
      <main className="flex-1">
        {/* contenuto pagina */}
      </main>
      <Footer />
    </div>
  );
}
