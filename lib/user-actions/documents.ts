"use server"

import { db } from "@/database/drizzle";
import { documents, documentTexts } from "@/database/schema";
import { UploadDocument, UploadDocumentText } from "@/types/types";
import { desc, eq } from "drizzle-orm";

export const getUserDocuments = async ({userId} : {userId : string}) => {
    try {
        const docs = await db
            .select()
            .from(documents)
            .where(eq(documents.ownerId, userId))
            .orderBy(desc(documents.createdAt))

        return {
            success: true,
            message: "Successfuly retrieved documents.",
            documents: docs,
        }
    } catch (error) {
        console.log(error);
        return{
            success: true,
            message: "Error getting user documents.",
            error: error,
        }
    }
}

export const uploadDocument = async ({document} : {document: UploadDocument}) => {
    try {
        const [doc] = await db.insert(documents).values({
            ...document
        }).returning({id: documents.id});

        return{
            success: true,
            message: "Successfully uploaded document",
            id: doc.id,
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Error uploading document",
            error: error,
        }
    }
}

export const uploadDocumentTexts = async ({documentText} : {documentText : UploadDocumentText}) => {
    try {
        await db.insert(documentTexts).values({
            ...documentText,
        })
        return {
            success: true,
            message: "Successfully uploaded document texts",
        }
    } catch (error) {
        console.log(error);
        return {
            success: false, 
            message: "Error uploading document texts",
        }
    }
}