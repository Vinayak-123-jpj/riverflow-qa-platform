"use client";

import { Models } from "appwrite";
import React from "react";
import VoteButtons from "./VoteButtons";
import { useAuthStore } from "@/store/Auth";
import { avatars } from "@/models/client/config";
import RTE, { MarkdownPreview } from "./RTE";
import Comments from "./Comments";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import { CheckCircle2 } from "lucide-react";

const Answers = ({
  answers: _answers,
  questionId,
}: {
  answers: Models.DocumentList<Models.Document>;
  questionId: string;
}) => {
  const [answers, setAnswers] = React.useState(_answers);
  const [newAnswer, setNewAnswer] = React.useState("");
  const [editingAnswerId, setEditingAnswerId] = React.useState<string | null>(
    null,
  );
  const [editContent, setEditContent] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAnswer || !user || submitting) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId: questionId,
          answer: newAnswer,
          authorId: user.$id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setNewAnswer("");
      setAnswers((prev) => ({
        total: prev.total + 1,
        documents: [
          {
            ...data,
            author: user,
            upvotesDocuments: { documents: [], total: 0 },
            downvotesDocuments: { documents: [], total: 0 },
            comments: { documents: [], total: 0 },
          },
          ...prev.documents,
        ],
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error creating answer");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAnswer = async (answerId: string) => {
    try {
      const response = await fetch("/api/answer", {
        method: "DELETE",
        body: JSON.stringify({
          answerId: answerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setAnswers((prev) => ({
        total: prev.total - 1,
        documents: prev.documents.filter((answer) => answer.$id !== answerId),
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error deleting answer");
    }
  };

  const startEdit = (answerId: string, content: string) => {
    setEditingAnswerId(answerId);
    setEditContent(content);
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditContent("");
  };

  const saveEdit = async (answerId: string) => {
    if (!editContent || !user) return;

    try {
      const response = await fetch("/api/answer", {
        method: "PUT",
        body: JSON.stringify({
          answerId: answerId,
          content: editContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw data;

      setAnswers((prev) => ({
        ...prev,
        documents: prev.documents.map((answer) =>
          answer.$id === answerId
            ? { ...answer, content: editContent }
            : answer,
        ),
      }));

      setEditingAnswerId(null);
      setEditContent("");
    } catch (error: any) {
      window.alert(error?.message || "Error updating answer");
    }
  };

  return (
    <div className="py-6">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
        <CheckCircle2 className="h-5 w-5 text-success" />
        {answers.total} {answers.total === 1 ? "Answer" : "Answers"}
      </h2>

      <div className="space-y-6">
        {answers.documents.map((answer) => (
          <div
            key={answer.$id}
            className="flex gap-4 border-b border-border pb-6 last:border-none"
          >
            <div className="flex shrink-0 flex-col items-center gap-2">
              <VoteButtons
                type="answer"
                id={answer.$id}
                upvotes={answer.upvotesDocuments}
                downvotes={answer.downvotesDocuments}
              />
              {user?.$id === answer.authorId && (
                <div className="flex gap-1.5">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    onClick={() => startEdit(answer.$id, answer.content)}
                    aria-label="Edit answer"
                  >
                    <IconEdit className="h-4 w-4" />
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                    onClick={() => deleteAnswer(answer.$id)}
                    aria-label="Delete answer"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="w-full min-w-0 space-y-3">
              {editingAnswerId === answer.$id ? (
                <div className="space-y-2">
                  <RTE
                    value={editContent}
                    onChange={(value) => setEditContent(value || "")}
                  />
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      onClick={() => saveEdit(answer.$id)}
                    >
                      Save
                    </button>
                    <button
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <MarkdownPreview
                  className="rounded-xl bg-transparent"
                  source={answer.content}
                />
              )}

              <div className="flex items-center justify-end gap-2.5">
                <div className="text-right leading-tight">
                  <Link
                    href={`/users/${answer.author.$id}/${slugify(answer.author.name)}`}
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {answer.author.name}
                  </Link>
                  <div>
                    <Badge variant="reputation" className="mt-0.5">
                      {answer.author.reputation} rep
                    </Badge>
                  </div>
                </div>
                <img
                  src={avatars.getInitials(answer.author.name, 36, 36).href}
                  alt={answer.author.name}
                  className="h-9 w-9 avatar-ring"
                />
              </div>

              <Comments
                comments={answer.comments}
                type="answer"
                typeId={answer.$id}
              />
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-3 rounded-xl border border-border bg-card/50 p-5"
      >
        <h3 className="text-base font-semibold text-foreground">Your Answer</h3>
        <RTE
          value={newAnswer}
          onChange={(value) => setNewAnswer(value || "")}
        />
        <button
          type="submit"
          disabled={submitting || !newAnswer}
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-glow disabled:opacity-40"
        >
          {submitting ? "Posting..." : "Post Your Answer"}
        </button>
      </form>
    </div>
  );
};

export default Answers;
