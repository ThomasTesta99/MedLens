"use server"

import { db } from "@/database/drizzle";
import { documents } from "@/database/schema";
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