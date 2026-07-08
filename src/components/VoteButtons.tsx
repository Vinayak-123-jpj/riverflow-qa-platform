"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

const VoteButtons = ({
  type,
  id,
  upvotes,
  downvotes,
  className,
}: {
  type: "question" | "answer";
  id: string;
  upvotes: Models.DocumentList<Models.Document>;
  downvotes: Models.DocumentList<Models.Document>;
  className?: string;
}) => {
  const [votedDocument, setVotedDocument] =
    React.useState<Models.Document | null>();
  const [voteResult, setVoteResult] = React.useState<number>(
    upvotes.total - downvotes.total,
  );
  const [pending, setPending] = React.useState(false);

  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      if (user) {
        const response = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", id),
          Query.equal("votedById", user.$id),
        ]);
        setVotedDocument(() => response.documents[0] || null);
      }
    })();
  }, [user, id, type]);

  const vote = async (voteStatus: "upvoted" | "downvoted") => {
    if (!user) return router.push("/login");
    if (votedDocument === undefined || pending) return;

    setPending(true);
    try {
      const response = await fetch(`/api/vote`, {
        method: "POST",
        body: JSON.stringify({
          votedById: user.$id,
          voteStatus,
          type,
          typeId: id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setVoteResult(() => data.data.voteResult);
      setVotedDocument(() => data.data.document);
    } catch (error: any) {
      window.alert(error?.message || "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  const isUp = votedDocument?.voteStatus === "upvoted";
  const isDown = votedDocument?.voteStatus === "downvoted";

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col items-center gap-1 rounded-2xl border border-border bg-card/60 p-2",
        className,
      )}
    >
      <button
        type="button"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-150",
          "hover:border-success/40 hover:bg-success/10 hover:text-success active:scale-95",
          isUp
            ? "border-success/50 bg-success/15 text-success"
            : "border-transparent text-muted-foreground",
        )}
        onClick={() => vote("upvoted")}
        disabled={pending}
        aria-label="Upvote"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <span
        className={cn(
          "min-w-[2ch] text-center text-sm font-bold tabular-nums",
          voteResult > 0 && "text-success",
          voteResult < 0 && "text-destructive",
          voteResult === 0 && "text-foreground",
        )}
      >
        {voteResult}
      </span>

      <button
        type="button"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-150",
          "hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive active:scale-95",
          isDown
            ? "border-destructive/50 bg-destructive/15 text-destructive"
            : "border-transparent text-muted-foreground",
        )}
        onClick={() => vote("downvoted")}
        disabled={pending}
        aria-label="Downvote"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
};

export default VoteButtons;
