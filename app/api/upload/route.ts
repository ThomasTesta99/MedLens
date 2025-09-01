import { db } from "@/database/drizzle";
import { documents, documentTexts } from "@/database/schema";
import { extractPdfText, ocrImageExtract } from "@/lib/extract";
import { getUserSession } from "@/lib/user-actions/authActions";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request){
    try {
        const session = await getUserSession();
        if(!session?.user?.id) return NextResponse.json({
            error: "Unauthorized",
            status: 401,
        })

        const form = await req.formData();
        const file = form.get('file') as File | null;
        const title = form.get('title') as string | null;
        if(!file) return NextResponse.json(
            {error: "No File."},
            {status: 400},
        )

        const isPdf = file.type === 'application/pdf';
        const sourceType = isPdf ? "pdf" : file.type.startsWith("image/") ? "image" : "other";
        if(sourceType === "other"){
            return NextResponse.json(
                {error: "Unsupported File Type"},
                {status: 400},
            );
        }

        let plainText = "";
        let pageCount = 0;
        let ingestMethod: "pdf_text" | "ocr" = "pdf_text";

        const buf = Buffer.from(await file.arrayBuffer());

        if(isPdf){
            const {text, pages} = await extractPdfText(buf);
            if(!text){
                return NextResponse.json(
                    {error: "Something unexpected happened with the text"},
                    {status: 400},
                );
            }else{
                plainText = text;
                pageCount = pages;
                ingestMethod = "pdf_text";
            }
        }else{
            const {text, pages} = await ocrImageExtract(buf);
            if(!text){
                return NextResponse.json(
                    {error: "Something unexpected happened with the text"},
                    {status: 400},
                );
            }else{
                plainText = text;
                pageCount = pages;
                ingestMethod = "ocr";
            }
        }

        const [document] = await db.insert(documents).values({
            ownerId: session.user.id,
            title, 
            sourceType, 
            ingestMethod,
            pageCount,
            status: "processing"
        }).returning({id: documents.id});

        await db.insert(documentTexts).values({
            documentId: document.id,
            language: 'en',
            plainText,
        })

        return NextResponse.json({id: document.id});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error}, {status:500});
    }
}