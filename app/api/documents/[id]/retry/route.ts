
import { db } from "@/database/drizzle";
import { documentEntities, documents, documentSentences, documentSummaries } from "@/database/schema";
import { enqueueProcessing } from "@/lib/pipeline";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
    req: Request, 
    {params} : {params: Promise<{id : string}>},
){
    const p = await params;
    const documentId = p.id;
    
    const document = await db.select().from(documents).where(eq(documents.id, documentId)).limit(1);
    
    if(!document){
        return NextResponse.json({error:"Document not found"}, {status: 404});
    }
    
    await db.delete(documentEntities).where(eq(documentEntities.documentId, documentId));
    await db.delete(documentSentences).where(eq(documentSentences.documentId, documentId));
    await db.delete(documentSummaries).where(eq(documentSummaries.documentId, documentId));

    await db.update(documents).set({status: "processing", error: null}).where(eq(documents.id, documentId));
    await enqueueProcessing(documentId);

    return NextResponse.json({ok: true});

}