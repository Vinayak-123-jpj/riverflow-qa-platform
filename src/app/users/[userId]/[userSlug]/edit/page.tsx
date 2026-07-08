"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { account } from "@/models/client/config";

const Page = () => {
  const { user } = useAuthStore();
  const { userId, userSlug } = useParams();
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  if (user?.$id !== userId) {
    router.push(`/users/${userId}/${userSlug}`);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await account.updateName(formData.name);
      if (formData.email !== user?.email) {
        await account.updateEmail(formData.email, user?.password || "");
      }
      router.push(`/users/${userId}/${userSlug}`);
    } catch (error: any) {
      setError(error.message || "Failed to update profile");
    }

    setLoading(false);
  };

  return (
    <div className="container relative mx-auto max-w-xl space-y-6 px-4 pb-20 pt-28">
      <div className="absolute inset-0 h-64 bg-hero-gradient pointer-events-none" />
      <div className="relative rounded-2xl border border-border bg-card/70 p-8 backdrop-blur-sm">
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          Edit Profile
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-center text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="you@example.com"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="bg-background"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-glow disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="rounded-lg border border-border px-6 py-2.5 font-medium text-foreground transition-colors hover:bg-accent"
              type="button"
              onClick={() => router.push(`/users/${userId}/${userSlug}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
