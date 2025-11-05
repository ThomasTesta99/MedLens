'use server'

import { db } from "@/database/drizzle";
import {documentEntities, documents, documentSentences, documentSummaries, documentTexts } from "@/database/schema";
import { UploadDocument, UploadDocumentText } from "@/types/types";
import { asc, desc, eq } from "drizzle-orm";
import { getUserSession } from "./authActions";

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
        return{
            success: false,
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
        return {
            success: false, 
            message: "Error uploading document texts",
            error: error,
        }
    }
}

export const getDocumentAndSummary = async ({documentId} : {documentId : string}) => {
    try {
        const [document] = await db
            .select().from(documents)
            .where(eq(documents.id, documentId))
            .limit(1);

        if(!document){
            return {
                success: false, 
                message: `Document with id ${documentId} not found`,
            }
        }

        const session = await getUserSession();
        if(session?.user.id !== document.ownerId){
            return {
                success: false,
                message: "Unautherized"
            }
        }

        const [summary] = await db
            .select()
            .from(documentSummaries)
            .where(eq(documentSummaries.documentId, documentId))
            .limit(1);

        const entities = await db
            .select()
            .from(documentEntities)
            .where(eq(documentEntities.documentId, documentId))
            .orderBy(documentEntities.label, documentEntities.score);

        const sentences = await db
            .select()
            .from(documentSentences)
            .where(eq(documentSentences.documentId, documentId))
            .orderBy(asc(documentSentences.idx));

        return{
            success: true, 
            message: "Success",
            document: document, 
            summary: summary, 
            entities: entities,
            sentences: sentences,
        }
    } catch (error) {
        return {
            success: false,
            message: "An error occured: " + error as string,
        }
    }
}

export const deleteDocumentData = async ({documentId} : {documentId: string}) => {
    try {
        const session = await getUserSession();
        if(!session?.user.id){
            return {
                success: false,
                message: "Unauthorized"
            };
        }

        const [document] = await db.select({ownerId: documents.ownerId})
            .from(documents)
            .where(eq(documents.id, documentId))
            .limit(1);

        if(!document || document.ownerId !== session.user.id){
            return {
                success: false, 
                message: "Unauthorized"
            }
        }

        await db.delete(documents).where(eq(documents.id, documentId));

        return {
            success: true, 
            message: "Successfully deleted document data",
        }
    } catch (error) {
        return {
            success: false,
            message: "There was an error deleting document data: " + error as string,
        }
    }
}