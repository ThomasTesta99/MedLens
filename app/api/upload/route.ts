import { extractPdfText, ocrImageExtract } from "@/lib/extract";
import { getUserSession } from "@/lib/user-actions/authActions";
import { uploadDocument, uploadDocumentTexts } from "@/lib/user-actions/documents";
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

        const documentData = {
            ownerId: session.user.id,
            title: title || '', 
            sourceType, 
            ingestMethod,
            pageCount,
            status: "processing"
        }
        const documentUploadResult = await uploadDocument({document: documentData});
        if(!documentUploadResult.success){
            return NextResponse.json(
                {error: documentUploadResult.message},
                {status: 400},
            )
        }

        const textData = {
            documentId: documentUploadResult.id,
            language: "en",
            plainText: plainText
        }

        const documentTextUploadResult = await uploadDocumentTexts({documentText: textData});
        if(!documentTextUploadResult.success){
            return NextResponse.json(
                {error: documentTextUploadResult.message},
                {status: 400},
            )
        }

        return NextResponse.json({id: documentUploadResult.id});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: error}, {status:500});
    }
}