import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import { avatars } from "@/models/client/config";
import {
  answerCollection,
  db,
  voteCollection,
  questionCollection,
  commentCollection,
  questionAttachmentBucket,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { storage } from "@/models/client/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { MessageSquare, ArrowUp, Clock } from "lucide-react";

const Page = async ({
  params,
}: {
  params: { quesId: string; quesName: string };
}) => {
  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, params.quesId),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", params.quesId),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", params.quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", params.quesId),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", params.quesId),
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  const author = await users.get<UserPrefs>(question.authorId);
  [comments.documents, answers.documents] = await Promise.all([
    Promise.all(
      comments.documents.map(async (comment) => {
        const author = await users.get<UserPrefs>(comment.authorId);
        return {
          ...comment,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      }),
    ),
    Promise.all(
      answers.documents.map(async (answer) => {
        const [author, comments, upvotes, downvotes] = await Promise.all([
          users.get<UserPrefs>(answer.authorId),
          databases.listDocuments(db, commentCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.orderDesc("$createdAt"),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1),
          ]),
        ]);

        comments.documents = await Promise.all(
          comments.documents.map(async (comment) => {
            const author = await users.get<UserPrefs>(comment.authorId);
            return {
              ...comment,
              author: {
                $id: author.$id,
                name: author.name,
                reputation: author.prefs.reputation,
              },
            };
          }),
        );

        return {
          ...answer,
          comments,
          upvotesDocuments: upvotes,
          downvotesDocuments: downvotes,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      }),
    ),
  ]);

  return (
    <div className="relative">
      <div className="absolute inset-0 h-96 bg-hero-gradient pointer-events-none" />
      <div className="container relative mx-auto max-w-4xl px-4 pb-20 pt-28">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {question.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                {answers.total} {answers.total === 1 ? "answer" : "answers"}
              </span>
              <span className="flex items-center gap-1.5">
                <ArrowUp className="h-3.5 w-3.5" />
                {upvotes.total + downvotes.total} votes
              </span>
            </div>
          </div>
          <Link href="/questions/ask" className="shrink-0">
            <span className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-glow">
              Ask a question
            </span>
          </Link>
        </div>

        <div className="h-px w-full bg-border" />

        {/* Question body */}
        <div className="flex gap-4 py-6">
          <div className="flex shrink-0 flex-col items-center gap-3">
            <VoteButtons
              type="question"
              id={question.$id}
              upvotes={upvotes}
              downvotes={downvotes}
            />
            <div className="flex flex-col gap-2">
              <EditQuestion
                questionId={question.$id}
                questionTitle={question.title}
                authorId={question.authorId}
              />
              <DeleteQuestion
                questionId={question.$id}
                authorId={question.authorId}
              />
            </div>
          </div>

          <div className="w-full min-w-0 space-y-4">
            <MarkdownPreview
              className="rounded-xl bg-transparent"
              source={question.content}
            />

            {question.attachmentId && (
              <picture>
                <img
                  src={
                    storage.getFilePreview(
                      questionAttachmentBucket,
                      question.attachmentId,
                    ).href
                  }
                  alt={question.title}
                  className="max-h-[420px] rounded-xl border border-border object-cover"
                />
              </picture>
            )}

            {question.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {question.tags.map((tag: string) => (
                  <Link key={tag} href={`/questions?tag=${tag}`}>
                    <Badge variant="tag">{tag}</Badge>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <div className="text-right leading-tight">
                <Link
                  href={`/users/${author.$id}/${slugify(author.name)}`}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {author.name}
                </Link>
                <div>
                  <Badge variant="reputation" className="mt-0.5">
                    {author.prefs.reputation} rep
                  </Badge>
                </div>
              </div>
              <img
                src={avatars.getInitials(author.name, 36, 36).href}
                alt={author.name}
                className="h-9 w-9 avatar-ring"
              />
            </div>

            <Comments
              comments={comments}
              type="question"
              typeId={question.$id}
            />
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        <Answers answers={answers} questionId={question.$id} />
      </div>
    </div>
  );
};

export default Page;
