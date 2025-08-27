import { integer, pgTable, text, timestamp, uuid, varchar, boolean, jsonb} from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").default("patient"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 256 }),
  sourceType: varchar("source_type", { length: 16 }),     // 'pdf' | 'image'
  ingestMethod: varchar("ingest_method", { length: 16 }), // 'pdf_text' | 'ocr'
  pageCount: integer("page_count").default(0),
  status: text("status").notNull().default("uploaded"),   // uploaded|processing|ready|error
  error: text("error"),   
  // dedupe/ops (of extracted text, not raw file)
  contentHash: varchar("content_hash", { length: 64 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentTexts = pgTable("document_texts", {
  documentId: uuid("document_id").primaryKey().references(() => documents.id, { onDelete: "cascade" }),
  language: varchar("language", { length: 8 }), // 'en'
  plainText: text("plain_text").notNull(),
});

export const documentSpans = pgTable("document_spans", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  page: integer("page"),
  start: integer("start").notNull(), 
  end: integer("end").notNull(),     
  snippet: text("snippet"),          
});

export const documentEntities = pgTable("document_entities", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 64 }).notNull(), // 'ANATOMY','CONDITION','MEASUREMENT','DATE',...
  start: integer("start").notNull(),
  end: integer("end").notNull(),
  text: text("text").notNull(),
  confidence: integer("confidence"), // 0-100
  codeSystem: varchar("code_system", { length: 32 }), // 'snomed','icd10',...
  code: varchar("code", { length: 32 }),
});

export const documentSummaries = pgTable("document_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" }),
  model: varchar("model", { length: 128 }),
  promptVersion: varchar("prompt_version", { length: 32 }),
  summaryMarkdown: text("summary_markdown").notNull(),
  suggestedQuestions: jsonb("suggested_questions"), // string[]
  citations: jsonb("citations"), // [{section:"key_findings", spanIds:["...","..."]}]
  createdAt: timestamp("created_at").defaultNow(),
});

export const auth_schema = {users, sessions, accounts, verifications};