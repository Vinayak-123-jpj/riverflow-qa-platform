"use client";

import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const EditQuestion = ({
  questionId,
  questionTitle,
  authorId,
}: {
  questionId: string;
  questionTitle: string;
  authorId: string;
}) => {
  const { user } = useAuthStore();

  return user?.$id === authorId ? (
    <Link
      href={`/questions/${questionId}/${slugify(questionTitle)}/edit`}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
      aria-label="Edit question"
    >
      <IconEdit className="h-4 w-4" />
    </Link>
  ) : null;
};

export default EditQuestion;
