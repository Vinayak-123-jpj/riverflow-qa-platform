import React from "react";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Footer = () => {
  const items = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      title: "Terms of Service",
      href: "/terms-of-service",
    },
    {
      title: "Questions",
      href: "/questions",
    },
  ];
  return (
    <footer className="relative border-t border-border bg-card py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {items.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} RiverFlow. All rights reserved.
        </div>
      </div>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(3000px_circle_at_center,white,transparent)]",
          "inset-y-[-50%] h-[200%] skew-y-6",
        )}
      />
    </footer>
  );
};

export default Footer;
