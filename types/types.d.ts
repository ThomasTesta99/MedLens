import { PgUUID } from "drizzle-orm/pg-core";

declare interface CreateUserInfo {
  name: string;
  email: string;
  password: string; 
}

declare interface SignInUserInfo{
  email: string;
  password: string;
}

declare interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  password?: string | null;
  role: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare interface UserProps{
  user?: User;
}

declare interface Document {
  id: PgUUID,
  ownerId: string, 
  title: string,
  fileUrl: string,
  pageCount: number,
  status: string,
  error: string | null,
  createdAt: Date,
}

declare interface UploadDocument{
  ownerId: string, 
  title: string, 
  sourceType: string, 
  ingestMethod: "pdf_text" | "ocr", 
  pageCount: number;
  status: string;
}

declare interface UploadDocumentText{
  documentId: stirng, 
  language: string,
  plainText: string,
}

interface GeminiCandidatePart {
  text?: string;
  inlineData?: { data: string };
}

interface GeminiContent {
  parts: GeminiCandidatePart[];
}

interface GeminiCandidate {
  content: GeminiContent;
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

export type Action = 'password-reset' | 'verify-email' | 'change-email' | "must-verify-email";