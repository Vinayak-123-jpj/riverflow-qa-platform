import {
  answerCollection,
  commentCollection,
  db,
  questionAttachmentBucket,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, storage } from "@/models/server/config";
import { Query } from "node-appwrite";

async function deleteAllDocuments(
  collectionId: string,
  queries: string[]
) {
  let offset = 0;
  const limit = 100;

  while (true) {
    const batch = await databases.listDocuments(db, collectionId, [
      ...queries,
      Query.limit(limit),
      Query.offset(offset),
    ]);

    if (batch.documents.length === 0) break;

    await Promise.all(
      batch.documents.map(doc =>
        databases.deleteDocument(db, collectionId, doc.$id)
      )
    );

    if (batch.documents.length < limit) break;
    offset += limit;
  }
}

export async function deleteVotesFor(
  type: "question" | "answer",
  typeId: string
) {
  await deleteAllDocuments(voteCollection, [
    Query.equal("type", type),
    Query.equal("typeId", typeId),
  ]);
}

export async function deleteCommentsFor(
  type: "question" | "answer",
  typeId: string
) {
  await deleteAllDocuments(commentCollection, [
    Query.equal("type", type),
    Query.equal("typeId", typeId),
  ]);
}

export async function deleteAnswerCascade(answerId: string) {
  await Promise.all([
    deleteCommentsFor("answer", answerId),
    deleteVotesFor("answer", answerId),
  ]);
  await databases.deleteDocument(db, answerCollection, answerId);
}

export async function deleteQuestionCascade(
  questionId: string,
  attachmentId?: string | null
) {
  const answers = await databases.listDocuments(db, answerCollection, [
    Query.equal("questionId", questionId),
    Query.limit(100),
  ]);

  await Promise.all(
    answers.documents.map(answer => deleteAnswerCascade(answer.$id))
  );

  await Promise.all([
    deleteCommentsFor("question", questionId),
    deleteVotesFor("question", questionId),
  ]);

  if (attachmentId) {
    try {
      await storage.deleteFile(questionAttachmentBucket, attachmentId);
    } catch {
      // attachment may already be removed
    }
  }

  await databases.deleteDocument(db, questionCollection, questionId);
}
