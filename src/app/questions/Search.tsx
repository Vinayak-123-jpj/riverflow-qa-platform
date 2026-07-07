"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = React.useState(searchParams.get("search") || "");

    React.useEffect(() => {
        setSearch(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams(searchParams);
        if (search.trim()) {
            newSearchParams.set("search", search.trim());
        } else {
            newSearchParams.delete("search");
        }
        newSearchParams.delete("page");
        router.push(`${pathname}?${newSearchParams}`);
    };

    const clearSearch = () => {
        setSearch("");
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("search");
        newSearchParams.delete("page");
        router.push(`${pathname}?${newSearchParams.toString() ? `?${newSearchParams}` : pathname}`);
    };

    const activeTag = searchParams.get("tag");

    return (
        <div className="space-y-3">
            <form className="relative flex w-full gap-2" onSubmit={handleSearch}>
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search questions by title or content..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-9 bg-card border-border focus-visible:ring-primary/30"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <Button type="submit" className="shrink-0 gap-2">
                    <SearchIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                </Button>
            </form>
            {activeTag && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filtered by tag:</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-sm text-primary">
                        {activeTag}
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.delete("tag");
                                router.push(`${pathname}?${params}`);
                            }}
                            className="hover:text-primary/70 transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                </div>
            )}
        </div>
    );
};

export default Search;
