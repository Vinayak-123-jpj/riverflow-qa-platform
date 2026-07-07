import React from "react";
import Link from "next/link";
import { Sparkles, Github, MessageCircleQuestion } from "lucide-react";

const Footer = () => {
    const items = [
        { title: "Home", href: "/" },
        { title: "Questions", href: "/questions" },
        { title: "Ask Question", href: "/questions/ask" },
        { title: "Login", href: "/login" },
        { title: "Register", href: "/register" },
    ];

    return (
        <footer className="relative mt-auto border-t border-border bg-card/50">
            <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
            <div className="container relative mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Brand */}
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                                <Sparkles className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-lg font-bold gradient-text">RiverFlow</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            A modern Q&A platform for developers. Ask questions, share knowledge,
                            and grow your reputation.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Navigation</h3>
                        <ul className="space-y-2">
                            {items.map(item => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground">Community</h3>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/questions"
                                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <MessageCircleQuestion className="h-4 w-4" />
                                Browse Questions
                            </Link>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                <Github className="h-4 w-4" />
                                Open Source
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} RiverFlow. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                        Built with Next.js, Appwrite & Tailwind CSS
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
