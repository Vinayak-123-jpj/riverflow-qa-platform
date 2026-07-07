import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "RiverFlow - Q&A Platform",
    description:
        "Ask questions, share knowledge, and collaborate with developers worldwide",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={cn(
                    inter.className,
                    "min-h-screen bg-background text-foreground antialiased flex flex-col"
                )}
            >
                <SessionProvider />
                <Header />
                <main className="flex-1 pt-16">{children}</main>
                <Footer />
                <Toaster />
            </body>
        </html>
    );
}
