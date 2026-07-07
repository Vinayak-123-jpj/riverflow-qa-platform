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
        <div className="space-y-6">
            {questions.documents.length === 0 ? (
                <p className="text-gray-500">No questions yet. Be the first to ask!</p>
            ) : (
                questions.documents.map(question => (
                    <QuestionCard key={question.$id} ques={question} />
                ))
            )}
        </div>
    );
};

export default LatestQuestions;
