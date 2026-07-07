"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: JSX.Element;
    }[];
    className?: string;
}) => {
    const { scrollYProgress, scrollY } = useScroll();

    const { session, logout } = useAuthStore();

    const [visible, setVisible] = useState(true);

    useMotionValueEvent(scrollYProgress, "change", current => {
        if (scrollY.get()! === 0) {
            setVisible(true);
            return;
        }
        if (typeof current === "number") {
            let direction = current! - scrollYProgress.getPrevious()!;

            if (scrollYProgress.get() < 0.05) {
                setVisible(false);
            } else {
                if (direction < 0) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            }
        }
    });

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{
                    opacity: 1,
                    y: -100,
                }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0,
                }}
                transition={{
                    duration: 0.2,
                }}
                className={cn(
                    "fixed inset-x-0 top-4 z-50 mx-auto flex max-w-fit items-center justify-center space-x-1 rounded-full border border-white/10 bg-background/80 px-6 py-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-background/80",
                    className
                )}
            >
                {navItems.map((navItem: any, idx: number) => (
                    <Link
                        key={`link=${idx}`}
                        href={navItem.link}
                        className={cn(
                            "relative flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                        )}
                    >
                        <span className="block sm:hidden">{navItem.icon}</span>
                        <span className="hidden sm:block">{navItem.name}</span>
                    </Link>
                ))}
                {session ? (
                    <button
                        onClick={logout}
                        className="relative rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                    >
                        <span>Logout</span>
                    </button>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="relative rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
                        >
                            <span>Login</span>
                        </Link>
                        <Link
                            href="/register"
                            className="relative rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                        >
                            <span>Sign Up</span>
                        </Link>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
