import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import convertDateToRelativeTime from "@/utils/relativeTime";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import { MessageSquare, ArrowRight } from "lucide-react";

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

  const answers = await databases.listDocuments(db, answerCollection, queries);

  answers.documents = await Promise.all(
    answers.documents.map(async (ans) => {
      const question = await databases.getDocument(
        db,
        questionCollection,
        ans.questionId,
        [Query.select(["title"])],
      );
      return { ...ans, question };
    }),
  );

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{answers.total}</span>{" "}
        answers
      </p>
      {answers.documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 p-14 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">No answers yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {answers.documents.map((ans) => (
            <div
              key={ans.$id}
              className="rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/30"
            >
              <div className="max-h-32 overflow-hidden text-sm text-muted-foreground">
                <MarkdownPreview
                  source={ans.content}
                  className="bg-transparent"
                />
              </div>
              <Link
                href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {ans.question.title}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {convertDateToRelativeTime(new Date(ans.$createdAt))}
              </p>
            </div>
          ))}
        </div>
      )}
      <Pagination total={answers.total} limit={25} />
    </div>
  );
};

export default Page;
