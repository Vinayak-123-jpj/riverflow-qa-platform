"use client";

import { databases } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { IconTrash } from "@tabler/icons-react";
import { ID, Models } from "appwrite";
import Link from "next/link";
import React from "react";

const Comments = ({
  comments: _comments,
  type,
  typeId,
  className,
}: {
  comments: Models.DocumentList<Models.Document>;
  type: "question" | "answer";
  typeId: string;
  className?: string;
}) => {
  const [comments, setComments] = React.useState(_comments);
  const [newComment, setNewComment] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    setSubmitting(true);
    try {
      const response = await databases.createDocument(
        db,
        commentCollection,
        ID.unique(),
        {
          content: newComment,
          authorId: user.$id,
          type: type,
          typeId: typeId,
        },
      );

      setNewComment("");
      setComments((prev) => ({
        total: prev.total + 1,
        documents: [{ ...response, author: user }, ...prev.documents],
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error creating comment");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await databases.deleteDocument(db, commentCollection, commentId);
      setComments((prev) => ({
        total: prev.total - 1,
        documents: prev.documents.filter(
          (comment) => comment.$id !== commentId,
        ),
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error deleting comment");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {comments.documents.length > 0 && (
        <ul className="space-y-1.5 border-l-2 border-border pl-4">
          {comments.documents.map((comment) => (
            <li
              key={comment.$id}
              className="group flex items-start justify-between gap-2 text-sm"
            >
              <p className="text-muted-foreground">
                {comment.content} <span className="text-foreground/70">·</span>{" "}
                <Link
                  href={`/users/${comment.authorId}/${slugify(comment.author.name)}`}
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {comment.author.name}
                </Link>{" "}
                <span className="text-xs text-muted-foreground/70">
                  {convertDateToRelativeTime(new Date(comment.$createdAt))}
                </span>
              </p>
              {user?.$id === comment.authorId && (
                <button
                  onClick={() => deleteComment(comment.$id)}
                  className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label="Delete comment"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {user && (
        <form onSubmit={handleSubmit} className="flex items-start gap-2 pl-4">
          <Textarea
            rows={1}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[38px] py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Comments;
