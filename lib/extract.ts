import "server-only";

export async function extractPdfText(data: Buffer) {
  const pdfParse = (await import("pdf-parse")).default;
  const { text, numpages } = await pdfParse(data);
  return { text: text?.trim() ?? "", pages: numpages ?? 0 };
}