"use client";

import React from "react";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { ArrowUp, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
    return (
        <Card className="group p-5 hover:shadow-card-hover hover:border-primary/30 transition-all duration-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* Stats column */}
                <div className="flex shrink-0 flex-row items-center gap-4 sm:flex-col sm:gap-3 sm:min-w-[72px] sm:text-center">
                    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-secondary/50 px-3 py-2 min-w-[60px]">
                        <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-base font-bold text-foreground">{ques.totalVotes}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">votes</span>
                    </div>
                    <div
                        className={cn(
                            "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 min-w-[60px]",
                            ques.totalAnswers > 0
                                ? "bg-success/10 border border-success/20"
                                : "bg-secondary/50"
                        )}
                    >
                        <MessageSquare
                            className={cn(
                                "h-3.5 w-3.5",
                                ques.totalAnswers > 0 ? "text-success" : "text-muted-foreground"
                            )}
                        />
                        <span
                            className={cn(
                                "text-base font-bold",
                                ques.totalAnswers > 0 ? "text-success" : "text-foreground"
                            )}
                        >
                            {ques.totalAnswers}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">answers</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <Link
                        href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                        className="block"
                    >
                        <h3 className="text-base font-semibold text-foreground transition-colors group-hover:text-primary leading-snug">
                            {ques.title}
                        </h3>
                    </Link>

                    {ques.tags?.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {ques.tags.map((tag: string) => (
                                <Link key={tag} href={`/questions?tag=${tag}`}>
                                    <Badge variant="tag">{tag}</Badge>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <img
                                src={avatars.getInitials(ques.author.name, 24, 24).href}
                                alt={ques.author.name}
                                className="h-6 w-6 rounded-full ring-1 ring-border"
                            />
                            <Link
                                href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                                className="font-medium text-foreground transition-colors hover:text-primary"
                            >
                                {ques.author.name}
                            </Link>
                        </div>
                        <Badge variant="reputation" className="text-[10px] px-1.5 py-0">
                            {ques.author.reputation}
                        </Badge>
                        <span>asked {convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default QuestionCard;
