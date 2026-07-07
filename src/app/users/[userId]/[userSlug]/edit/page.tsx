"use client";

import Meteors from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { account } from "@/models/client/config";

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
                "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
                className
            )}
        >
            <Meteors number={30} />
            {children}
        </div>
    );
};

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
            await account.updateEmail(formData.email, user?.password || "");
            
            // Redirect back to profile
            router.push(`/users/${userId}/${userSlug}`);
        } catch (error: any) {
            setError(error.message || "Failed to update profile");
        }

        setLoading(false);
    };

    return (
        <div className="container mx-auto max-w-2xl space-y-4 px-4 pb-20 pt-32">
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                    <LabelInputContainer>
                        <div className="text-center">
                            <span className="text-red-500">{error}</span>
                        </div>
                    </LabelInputContainer>
                )}
                <LabelInputContainer>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                </LabelInputContainer>
                <LabelInputContainer>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                </LabelInputContainer>
                <div className="flex gap-4">
                    <button
                        className="rounded bg-orange-500 px-6 py-2 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        className="rounded bg-gray-500 px-6 py-2 font-bold text-white hover:bg-gray-600"
                        type="button"
                        onClick={() => router.push(`/users/${userId}/${userSlug}`)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Page;
