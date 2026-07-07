import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";
import { Models } from "node-appwrite";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion } from "lucide-react";

const LatestQuestions = async () => {
    let questions: Models.DocumentList<Models.Document> = { documents: [], total: 0 };

    try {
        questions = await databases.listDocuments(db, questionCollection, [
            Query.limit(5),
            Query.orderDesc("$createdAt"),
        ]);

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
    } catch {
        // Error fetching questions
    }

    if (questions.documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <MessageCircleQuestion className="h-7 w-7 text-primary" />
                </div>
                <p className="text-lg font-semibold text-foreground">No questions yet</p>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Be the first to ask a question and help build our community!
                </p>
                <Link href="/questions/ask" className="mt-6">
                    <Button>Ask the First Question</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {questions.documents.map((question, i) => (
                <div
                    key={question.$id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 80}ms` }}
                >
                    <QuestionCard ques={question} />
                </div>
            ))}
        </div>
    );
};

export default LatestQuestions;
