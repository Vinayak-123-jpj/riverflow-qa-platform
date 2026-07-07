"use client";

import React from "react";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { ArrowUp, ArrowDown, MessageSquare, Eye } from "lucide-react";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* Votes and Answers */}
                <div className="flex shrink-0 flex-row items-center gap-6 sm:flex-col sm:gap-2 sm:text-center">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <ArrowUp className="h-4 w-4" />
                        <span className="font-semibold text-foreground">{ques.totalVotes}</span>
                        <span className="text-xs">votes</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-semibold text-foreground">{ques.totalAnswers}</span>
                        <span className="text-xs">answers</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <Link
                        href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                        className="block"
                    >
                        <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                            {ques.title}
                        </h3>
                    </Link>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {ques.tags.map((tag: string) => (
                            <Link
                                key={tag}
                                href={`/questions?tag=${tag}`}
                                className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-primary/20">
                                <img
                                    src={avatars.getInitials(ques.author.name, 32, 32).href}
                                    alt={ques.author.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <Link
                                href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                                className="font-medium text-foreground transition-colors hover:text-primary"
                            >
                                {ques.author.name}
                            </Link>
                        </div>
                        <span className="font-medium text-primary">
                            {ques.author.reputation}
                        </span>
                        <span>•</span>
                        <span>asked {convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
