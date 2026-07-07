import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases } from "@/models/server/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import { storage } from "@/models/client/config";
import HeroSectionHeader from "./HeroSectionHeader";
import { Models } from "node-appwrite";

export default async function HeroSection() {
    let questions: Models.DocumentList<Models.Document> = { documents: [], total: 0 };
    
    try {
        questions = await databases.listDocuments(db, questionCollection, [
            Query.orderDesc("$createdAt"),
            Query.limit(15),
        ]);
    } catch (error) {
        // Error fetching questions for hero section
    }

    return (
        <HeroParallax
            header={<HeroSectionHeader />}
            products={questions.documents.map(q => ({
                title: q.title,
                link: `/questions/${q.$id}/${slugify(q.title)}`,
                thumbnail: storage.getFilePreview(questionAttachmentBucket, q.attachmentId).href,
            }))}
        />
    );
}
