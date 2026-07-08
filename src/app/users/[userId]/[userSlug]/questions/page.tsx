import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";
import { MessageCircleQuestion } from "lucide-react";

const Page = async ({
  params,
  searchParams,
}: {
  params: { userId: string; userSlug: string };
  searchParams: { page?: string };
}) => {
  searchParams.page ||= "1";

  const queries = [
    Query.equal("authorId", params.userId),
    Query.orderDesc("$createdAt"),
    Query.offset((+searchParams.page - 1) * 25),
    Query.limit(25),
  ];

  const questions = await databases.listDocuments(
    db,
    questionCollection,
    queries,
  );

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
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
    }),
  );

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{questions.total}</span>{" "}
        questions
      </p>
      {questions.documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-14 text-center">
          <MessageCircleQuestion className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">No questions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.documents.map((ques) => (
            <QuestionCard key={ques.$id} ques={ques} />
          ))}
        </div>
      )}
      <Pagination total={questions.total} limit={25} />
    </div>
  );
};

export default Page;
