"use client";

import Link from "next/link";
import React from "react";
import { useAuthStore } from "@/store/Auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    MessageCircleQuestion,
    Users,
    TrendingUp,
    Sparkles,
    Code2,
    Zap,
} from "lucide-react";

const HeroSectionHeader = () => {
    const { session } = useAuthStore();

    const stats = [
        { label: "Active Questions", value: "1K+", icon: MessageCircleQuestion },
        { label: "Developers", value: "500+", icon: Users },
        { label: "Answers Daily", value: "100+", icon: TrendingUp },
    ];

    const techStack = [
        "React", "Next.js", "TypeScript", "Node.js", "Python",
        "Docker", "AWS", "PostgreSQL", "GraphQL", "Rust",
    ];

    return (
        <section className="relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-hero-gradient" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(271_91%_65%/0.08),transparent_60%)]" />
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="container relative mx-auto max-w-6xl px-4 py-24 md:py-32">
                <div className="mx-auto max-w-3xl text-center animate-fade-in">
                    <Badge variant="default" className="mb-6 gap-1.5 px-3 py-1">
                        <Sparkles className="h-3 w-3" />
                        Developer Q&A Platform
                    </Badge>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        <span className="gradient-text">RiverFlow</span>
                    </h1>

                    <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl max-w-2xl mx-auto">
                        Ask questions, share knowledge, and collaborate with developers
                        worldwide. Join our community and enhance your coding skills.
                    </p>

                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        {session ? (
                            <Link href="/questions/ask">
                                <Button size="lg" className="gap-2 px-8">
                                    <MessageCircleQuestion className="h-4 w-4" />
                                    Ask a Question
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/register">
                                    <Button size="lg" className="gap-2 px-8">
                                        Get Started Free
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="lg" className="gap-2 px-8">
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                        <Link href="/questions">
                            <Button variant="ghost" size="lg" className="gap-2 text-muted-foreground">
                                Browse Questions
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3 animate-slide-up">
                    {stats.map(stat => (
                        <div
                            key={stat.label}
                            className="flex items-center gap-4 rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/80"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <stat.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tech tags */}
                <div className="mt-16 text-center animate-fade-in">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Code2 className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Popular topics</p>
                        <Zap className="h-4 w-4 text-warning" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {techStack.map(tag => (
                            <Link key={tag} href={`/questions?tag=${tag.toLowerCase()}`}>
                                <Badge variant="tag" className="cursor-pointer px-3 py-1">
                                    {tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSectionHeader;
