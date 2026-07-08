import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import { Award, MessageCircleQuestion, MessageSquare } from "lucide-react";

const Page = async ({
  params,
}: {
  params: { userId: string; userSlug: string };
}) => {
  const [user, questions, answers] = await Promise.all([
    users.get<UserPrefs>(params.userId),
    databases.listDocuments(db, questionCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1),
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", params.userId),
      Query.limit(1),
    ]),
  ]);

  const stats = [
    { label: "Reputation", value: user.prefs.reputation, icon: Award },
    {
      label: "Questions asked",
      value: questions.total,
      icon: MessageCircleQuestion,
    },
    { label: "Answers given", value: answers.total, icon: MessageSquare },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/60 p-8 text-center transition-all hover:border-primary/30 hover:bg-card"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <stat.icon className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default Page;
