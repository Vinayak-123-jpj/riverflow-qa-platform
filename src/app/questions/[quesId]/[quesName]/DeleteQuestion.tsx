"use client";

import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

const DeleteQuestion = ({
  questionId,
  authorId,
}: {
  questionId: string;
  authorId: string;
}) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const deleteQuestion = async () => {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    try {
      await databases.deleteDocument(db, questionCollection, questionId);
      router.push("/questions");
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    }
  };

  return user?.$id === authorId ? (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
      onClick={deleteQuestion}
      aria-label="Delete question"
    >
      <IconTrash className="h-4 w-4" />
    </button>
  ) : null;
};

export default DeleteQuestion;
