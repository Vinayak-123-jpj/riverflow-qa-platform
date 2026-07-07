import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <>
            <HeroSection />
            <section className="container mx-auto max-w-6xl px-4 py-16">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Latest Questions</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Recently asked by the community
                        </p>
                    </div>
                    <Link href="/questions" className="hidden sm:block">
                        <Button variant="outline" size="sm" className="gap-2">
                            View All
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
                <LatestQuestions />
                <div className="mt-8 text-center sm:hidden">
                    <Link href="/questions">
                        <Button variant="outline" className="gap-2">
                            View All Questions
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </>
    );
}
