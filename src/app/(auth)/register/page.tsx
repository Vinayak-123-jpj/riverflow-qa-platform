"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

export default function Register() {
  const { login, createAccount } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!firstname || !lastname || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }

    if (password.toString().length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const response = await createAccount(
      `${firstname} ${lastname}`,
      email.toString(),
      password.toString(),
    );

    if (response.error) {
      toast({
        title: "Registration Failed",
        description: response.error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account Created",
        description: "Logging you in...",
      });
      const loginResponse = await login(email.toString(), password.toString());
      if (loginResponse.error) {
        toast({
          title: "Login Failed",
          description: "Please try logging in manually",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Welcome to RiverFlow!",
        });
        router.push("/");
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Sign in
          </Link>
        </p>
      </div>

      {isLoading && (
        <div className="mb-4 text-center text-sm text-muted-foreground">
          Creating account...
        </div>
      )}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Label htmlFor="firstname" className="text-sm font-medium">
              First name
            </Label>
            <Input
              id="firstname"
              name="firstname"
              placeholder="John"
              type="text"
              className="bg-background"
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label htmlFor="lastname" className="text-sm font-medium">
              Last name
            </Label>
            <Input
              id="lastname"
              name="lastname"
              placeholder="Doe"
              type="text"
              className="bg-background"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters
          </p>
        </div>
        <button
          className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:shadow-glow disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
