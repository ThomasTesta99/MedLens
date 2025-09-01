import pdfParse from 'pdf-parse';
import {createWorker} from "tesseract.js"

export async function extractPdfText(buffer: Buffer){ 
  const {text, numpages} = await pdfParse(buffer); 
  return { 
    text: text?.trim() ?? '', 
    pages: numpages ?? 0 
  }
}

export async function ocrImageExtract(buffer: Buffer){
  const worker = await createWorker("eng");
 
  const {data} = await worker.recognize(buffer);
  await worker.terminate();
  return{
    text: (data?.text ?? "").trim(),
    pages: 1 as const
  }
}