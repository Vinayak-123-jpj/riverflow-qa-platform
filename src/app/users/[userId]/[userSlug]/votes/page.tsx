import Pagination from "@/components/Pagination";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases } from "@/models/server/config";
import { cn } from "@/lib/utils";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const Page = async ({
  params,
  searchParams,
}: {
  params: { userId: string; userSlug: string };
  searchParams: { page?: string; voteStatus?: "upvoted" | "downvoted" };
}) => {
  searchParams.page ||= "1";

  const query = [
    Query.equal("votedById", params.userId),
    Query.orderDesc("$createdAt"),
    Query.offset((+searchParams.page - 1) * 25),
    Query.limit(25),
  ];

  if (searchParams.voteStatus)
    query.push(Query.equal("voteStatus", searchParams.voteStatus));

  const votes = await databases.listDocuments(db, voteCollection, query);

  votes.documents = await Promise.all(
    votes.documents.map(async (vote) => {
      const questionOfTypeQuestion =
        vote.type === "question"
          ? await databases.getDocument(db, questionCollection, vote.typeId, [
              Query.select(["title"]),
            ])
          : null;

      if (questionOfTypeQuestion) {
        return { ...vote, question: questionOfTypeQuestion };
      }

      const answer = await databases.getDocument(
        db,
        answerCollection,
        vote.typeId,
      );
      const questionOfTypeAnswer = await databases.getDocument(
        db,
        questionCollection,
        answer.questionId,
        [Query.select(["title"])],
      );

      return { ...vote, question: questionOfTypeAnswer };
    }),
  );

  const filters = [
    { label: "All", value: undefined },
    { label: "Upvotes", value: "upvoted" },
    { label: "Downvotes", value: "downvoted" },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{votes.total}</span>{" "}
          votes
        </p>
        <ul className="flex gap-2">
          {filters.map((f) => {
            const isActive =
              f.value === searchParams.voteStatus ||
              (!f.value && !searchParams.voteStatus);
            return (
              <li key={f.label}>
                <Link
                  href={
                    f.value
                      ? `/users/${params.userId}/${params.userSlug}/votes?voteStatus=${f.value}`
                      : `/users/${params.userId}/${params.userSlug}/votes`
                  }
                  className={cn("pill-link", isActive && "pill-link-active")}
                >
                  {f.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {votes.documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-14 text-center">
          <p className="font-medium text-foreground">No votes yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {votes.documents.map((vote) => (
            <div
              key={vote.$id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-4 transition-colors hover:border-primary/30"
            >
              <Badge
                variant={
                  vote.voteStatus === "upvoted" ? "success" : "destructive"
                }
                className="flex shrink-0 items-center gap-1"
              >
                {vote.voteStatus === "upvoted" ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {vote.voteStatus}
              </Badge>
              <Link
                href={`/questions/${vote.question.$id}/${slugify(vote.question.title)}`}
                className="min-w-0 flex-1 truncate text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {vote.question.title}
              </Link>
              <p className="shrink-0 text-xs text-muted-foreground">
                {convertDateToRelativeTime(new Date(vote.$createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}
      <Pagination total={votes.total} limit={25} />
    </div>
  );
};

export default Page;
