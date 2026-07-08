"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

const Navbar = () => {
  const { userId, userSlug } = useParams();
  const pathname = usePathname();

  const items = [
    { name: "Summary", href: `/users/${userId}/${userSlug}` },
    { name: "Questions", href: `/users/${userId}/${userSlug}/questions` },
    { name: "Answers", href: `/users/${userId}/${userSlug}/answers` },
    { name: "Votes", href: `/users/${userId}/${userSlug}/votes` },
  ];

  return (
    <ul className="flex w-full shrink-0 gap-1 overflow-auto sm:w-44 sm:flex-col">
      {items.map((item) => (
        <li key={item.name} className="shrink-0">
          <Link
            href={item.href}
            className={cn(
              "block w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
