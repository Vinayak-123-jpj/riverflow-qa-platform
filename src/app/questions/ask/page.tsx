import QuestionForm from "@/components/QuestionForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine } from "lucide-react";

const Page = () => {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <PenLine className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">Ask a Question</h1>
                </div>
                <p className="text-sm text-muted-foreground ml-12">
                    Share your problem with the community and get expert answers
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Question Details</CardTitle>
                    <CardDescription>
                        Be specific and provide enough context for others to help you
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <QuestionForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
