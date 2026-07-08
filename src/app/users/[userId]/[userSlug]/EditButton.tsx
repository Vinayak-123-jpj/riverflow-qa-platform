"use client";

import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Settings } from "lucide-react";
import React from "react";

const EditButton = () => {
  const { userId, userSlug } = useParams();
  const { user } = useAuthStore();

  if (user?.$id !== userId) return null;

  return (
    <Link
      href={`/users/${userId}/${userSlug}/edit`}
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
    >
      <Settings className="h-4 w-4" />
      Edit profile
    </Link>
  );
};

export default EditButton;
