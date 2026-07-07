import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <LatestQuestions />
      </div>
      <Footer />
    </main>
  );
}
