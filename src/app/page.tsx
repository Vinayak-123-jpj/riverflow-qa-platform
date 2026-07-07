import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-20">
        <h2 className="mb-8 text-3xl font-bold">Latest Questions</h2>
        <LatestQuestions />
      </div>
      <Footer />
    </main>
  );
}
