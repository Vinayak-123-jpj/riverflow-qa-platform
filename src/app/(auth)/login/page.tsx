"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>;
};

export default function Login() {
    const { login } = useAuthStore();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password) {
            toast({
                title: "Error",
                description: "Please fill out all fields",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        const loginResponse = await login(email.toString(), password.toString());

        if (loginResponse.error) {
            toast({
                title: "Login Failed",
                description: loginResponse.error.message,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Success",
                description: "Logged in successfully!",
            });
            router.push("/");
        }

        setIsLoading(false);
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                    Welcome back
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-primary transition-colors hover:text-primary/80"
                    >
                        Sign up
                    </Link>
                </p>
            </div>

            {isLoading && (
                <div className="mb-4 text-center text-sm text-muted-foreground">Logging in...</div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        className="bg-background"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        type="password"
                        className="bg-background"
                    />
                </div>
                <button
                    className="group/btn relative w-full overflow-hidden rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90"
                    type="submit"
                    disabled={isLoading}
                >
                    <span className="relative z-10">Sign in</span>
                    <BottomGradient />
                </button>
            </form>
        </div>
    );
}
