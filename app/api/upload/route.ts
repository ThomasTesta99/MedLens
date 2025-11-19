import { extractPdfText } from "@/lib/extract"; // 👈 remove ocrImageExtract here
import { getUserSession } from "@/lib/user-actions/authActions";
import { uploadDocument, uploadDocumentTexts } from "@/lib/user-actions/documents";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

async function ingestPlainTextDocument(opts: {
  ownerId: string;
  title: string;
  plainText: string;
  sourceType: "pdf" | "image";
  ingestMethod: "pdf_text" | "ocr";
  pageCount: number;
}) {
  const { ownerId, title, plainText, sourceType, ingestMethod, pageCount } = opts;

  const documentData = {
    ownerId,
    title,
    sourceType,
    ingestMethod,
    pageCount,
    status: "processing" as const,
  };

  const documentUploadResult = await uploadDocument({ document: documentData });
  if (!documentUploadResult.success) {
    return NextResponse.json(
      { error: documentUploadResult.message },
      { status: 400 },
    );
  }

  const textData = {
    documentId: documentUploadResult.id,
    language: "en",
    plainText,
  };

  const documentTextUploadResult = await uploadDocumentTexts({
    documentText: textData,
  });
  if (!documentTextUploadResult.success) {
    return NextResponse.json(
      { error: documentTextUploadResult.message },
      { status: 400 },
    );
  }

  return NextResponse.json({ id: documentUploadResult.id });
}

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", status: 401 },
        { status: 401 },
      );
    }

    const contentType = req.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const title = (body.title as string | undefined) ?? "";
      const text = (body.text as string | undefined) ?? "";
      const pageCount = (body.pageCount as number | undefined) ?? 1;
      const sourceType =
        (body.sourceType as "image" | "pdf" | undefined) ?? "image";
      const ingestMethod =
        (body.ingestMethod as "ocr" | "pdf_text" | undefined) ?? "ocr";

      if (!text.trim()) {
        return NextResponse.json(
          { error: "No OCR text provided." },
          { status: 400 },
        );
      }

      return ingestPlainTextDocument({
        ownerId: session.user.id,
        title,
        plainText: text,
        sourceType,
        ingestMethod,
        pageCount,
      });
    }

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      const title = (form.get("title") as string | null) ?? "";

      if (!file) {
        return NextResponse.json(
          { error: "No File." },
          { status: 400 },
        );
      }

      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        return NextResponse.json(
          { error: "Only PDFs should be uploaded directly." },
          { status: 400 },
        );
      }

      const buf = Buffer.from(await file.arrayBuffer());
      const { text, pages } = await extractPdfText(buf);

      if (!text) {
        return NextResponse.json(
          { error: "Something unexpected happened with the text" },
          { status: 400 },
        );
      }

      return ingestPlainTextDocument({
        ownerId: session.user.id,
        title,
        plainText: text,
        sourceType: "pdf",
        ingestMethod: "pdf_text",
        pageCount: pages || 1,
      });
    }

    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 400 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error },
      { status: 500 },
    );
  }
}
