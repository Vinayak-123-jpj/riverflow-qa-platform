import { db, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { Query } from "node-appwrite";

export async function getVoteScore(
  type: "question" | "answer",
  typeId: string
): Promise<number> {
  const [upvotes, downvotes] = await Promise.all([
    databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1),
    ]),
  ]);

  return upvotes.total - downvotes.total;
}
