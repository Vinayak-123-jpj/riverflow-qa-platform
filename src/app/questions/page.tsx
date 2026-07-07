import { databases, users } from "@/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageCircleQuestion } from "lucide-react";

const Page = async ({
    searchParams,
}: {
    searchParams: { page?: string; tag?: string; search?: string };
}) => {
    searchParams.page ||= "1";

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+searchParams.page - 1) * 25),
        Query.limit(25),
    ];

    if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag));
    if (searchParams.search)
        queries.push(
            Query.or([
                Query.search("title", searchParams.search),
                Query.search("content", searchParams.search),
            ])
        );

    const questions = await databases.listDocuments(db, questionCollection, queries);

    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1),
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1),
                ]),
            ]);

            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                },
            };
        })
    );

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <MessageCircleQuestion className="h-5 w-5 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">All Questions</h1>
                    </div>
                    <p className="text-sm text-muted-foreground ml-12">
                        Browse and search the community knowledge base
                    </p>
                </div>
                <Link href="/questions/ask">
                    <Button className="gap-2 shrink-0">
                        <Plus className="h-4 w-4" />
                        Ask Question
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <Search />
            </div>

            {/* Count */}
            <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                    {questions.total} {questions.total === 1 ? "question" : "questions"}
                </Badge>
            </div>

            {/* Questions list */}
            {questions.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
                    <MessageCircleQuestion className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-lg font-semibold">No questions found</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or be the first to ask!
                    </p>
                    <Link href="/questions/ask" className="mt-6">
                        <Button>Ask a Question</Button>
                    </Link>
                </div>
            ) : (
                <div className="mb-8 space-y-4">
                    {questions.documents.map(ques => (
                        <QuestionCard key={ques.$id} ques={ques} />
                    ))}
                </div>
            )}

            <Pagination total={questions.total} limit={25} />
        </div>
    );
};

export default Page;
