"use client";

import RTE from "@/components/RTE";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col space-y-2 rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

const QuestionForm = ({ question }: { question?: Models.Document }) => {
  const { user } = useAuthStore();
  const [tag, setTag] = React.useState("");
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    title: String(question?.title || ""),
    content: String(question?.content || ""),
    authorId: user?.$id,
    tags: new Set((question?.tags || []) as string[]),
    attachment: null as File | null,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const addTag = () => {
    if (tag.trim().length === 0) return;
    setFormData((prev) => ({
      ...prev,
      tags: new Set([...Array.from(prev.tags), tag.trim().toLowerCase()]),
    }));
    setTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: new Set(Array.from(prev.tags).filter((t) => t !== tagToRemove)),
    }));
  };

  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const create = async () => {
    if (!formData.attachment) throw new Error("Please upload an image");

    const storageResponse = await storage.createFile(
      questionAttachmentBucket,
      ID.unique(),
      formData.attachment,
    );

    const response = await databases.createDocument(
      db,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: storageResponse.$id,
      },
    );

    loadConfetti();

    return response;
  };

  const update = async () => {
    if (!question) throw new Error("Please provide a question");

    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId as string;

      await storage.deleteFile(questionAttachmentBucket, question.attachmentId);

      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment,
      );

      return file.$id;
    })();

    const response = await databases.updateDocument(
      db,
      questionCollection,
      question.$id,
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: attachmentId,
      },
    );

    return response;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.authorId) {
      setError(() => "Please fill out all fields");
      return;
    }

    setLoading(() => true);
    setError(() => "");

    try {
      const response = question ? await update() : await create();
      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (error: any) {
      setError(() => error.message);
    }

    setLoading(() => false);
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <span className="text-destructive">{error}</span>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title
          <span className="ml-1 font-normal text-muted-foreground">
            — Be specific and imagine you&apos;re asking a question to another
            person
          </span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="bg-background"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content" className="text-sm font-medium">
          Details
          <span className="ml-1 font-normal text-muted-foreground">
            — Introduce the problem and expand on what you put in the title
            (minimum 20 characters)
          </span>
        </Label>
        <RTE
          value={formData.content}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, content: value || "" }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image" className="text-sm font-medium">
          Image
          <span className="ml-1 font-normal text-muted-foreground">
            — Add an image to make your question clearer (optional)
          </span>
        </Label>
        <Input
          id="image"
          name="image"
          accept="image/*"
          type="file"
          className="bg-background"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            setFormData((prev) => ({
              ...prev,
              attachment: files[0],
            }));
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tag" className="text-sm font-medium">
          Tags
          <span className="ml-1 font-normal text-muted-foreground">
            — Add tags to describe what your question is about
          </span>
        </Label>
        <div className="flex w-full gap-3">
          <div className="flex-1">
            <Input
              id="tag"
              name="tag"
              placeholder="e.g. java, c, objective-c"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="bg-background"
            />
          </div>
          <button
            type="button"
            onClick={addTag}
            className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        {formData.tags.size > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {Array.from(formData.tags).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-primary/70 transition-colors hover:text-destructive"
                >
                  <IconX size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-glow disabled:opacity-50"
      >
        {loading
          ? "Submitting..."
          : question
            ? "Update Question"
            : "Post Question"}
      </button>
    </form>
  );
};

export default QuestionForm;
