import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("skeleton-shimmer rounded-md", className)}
            {...props}
        />
    );
}

function QuestionCardSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex gap-4">
                <div className="flex flex-col gap-2 items-center">
                    <Skeleton className="h-8 w-12" />
                    <Skeleton className="h-8 w-12" />
                </div>
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Skeleton, QuestionCardSkeleton };
