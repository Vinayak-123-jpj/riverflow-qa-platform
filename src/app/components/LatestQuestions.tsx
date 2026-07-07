import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";
import { Models } from "node-appwrite";

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
    } catch (error) {
        // Error fetching questions
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Latest Questions</h2>
            {questions.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
                    <p className="text-lg font-medium text-muted-foreground">No questions yet</p>
                    <p className="mt-2 text-sm text-muted-foreground">Be the first to ask a question!</p>
                </div>
            ) : (
                questions.documents.map(question => (
                    <QuestionCard key={question.$id} ques={question} />
                ))
            )}
        </div>
    );
};

export default LatestQuestions;
