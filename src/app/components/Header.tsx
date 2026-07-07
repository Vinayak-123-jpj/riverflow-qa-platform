"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Home,
    MessageCircleQuestion,
    User,
    LogOut,
    LogIn,
    UserPlus,
    Menu,
    X,
    Sparkles,
} from "lucide-react";

export default function Header() {
    const { user, session, logout } = useAuthStore();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    React.useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Questions", href: "/questions", icon: MessageCircleQuestion },
    ];

    if (user) {
        navItems.push({
            name: "Profile",
            href: `/users/${user.$id}/${slugify(user.name)}`,
            icon: User,
        });
    }

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                scrolled
                    ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all group-hover:bg-primary/20 group-hover:ring-primary/40">
                        <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                        <span className="gradient-text">RiverFlow</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                isActive(item.href)
                                    ? "bg-accent text-foreground"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth */}
                <div className="hidden items-center gap-2 md:flex">
                    {session ? (
                        <>
                            <Link href="/questions/ask">
                                <Button size="sm" className="gap-1.5">
                                    Ask Question
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                className="gap-1.5 text-muted-foreground"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="gap-1.5">
                                    <LogIn className="h-4 w-4" />
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="gap-1.5">
                                    <UserPlus className="h-4 w-4" />
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-accent/50 md:hidden"
                    onClick={() => setMobileOpen(prev => !prev)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden animate-slide-up">
                    <div className="container mx-auto space-y-1 px-4 py-4">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "bg-accent text-foreground"
                                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                        <div className="border-t border-border pt-3 space-y-2">
                            {session ? (
                                <>
                                    <Link href="/questions/ask" className="block">
                                        <Button className="w-full">Ask Question</Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={logout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="block">
                                        <Button variant="outline" className="w-full gap-2">
                                            <LogIn className="h-4 w-4" />
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/register" className="block">
                                        <Button className="w-full gap-2">
                                            <UserPlus className="h-4 w-4" />
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
