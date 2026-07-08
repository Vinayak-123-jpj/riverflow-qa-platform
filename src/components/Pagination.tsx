"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const Pagination = ({
  className,
  total,
  limit,
}: {
  className?: string;
  limit: number;
  total: number;
}) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const router = useRouter();
  const pathname = usePathname();

  const goTo = (n: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${n}`);
    router.push(`${pathname}?${newSearchParams}`);
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-3 pt-6", className)}
    >
      <button
        className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
        onClick={() => goTo(parseInt(page) - 1)}
        disabled={page <= "1"}
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>
      <span className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        {totalPages}
      </span>
      <button
        className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-40"
        onClick={() => goTo(parseInt(page) + 1)}
        disabled={page >= `${totalPages}`}
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
