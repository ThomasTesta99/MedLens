
import { integer, pgTable, text, timestamp, uuid, varchar, boolean, jsonb, json} from "drizzle-orm/pg-core";


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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentTexts = pgTable("document_texts", {
  documentId: uuid("document_id").primaryKey().references(() => documents.id, { onDelete: "cascade" }),
  language: varchar("language", { length: 8 }), // 'en'
  plainText: text("plain_text").notNull(),
});

export const documentEntities = pgTable("document_entities", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull(),
  label: text("label").notNull(),          
  text: text("text").notNull(),
  start: integer("start").notNull(),
  end: integer("end").notNull(),
  score: text("score"),                   
  createdAt: timestamp("created_at").defaultNow(),
});

export const documentSummaries = pgTable("document_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull(),
  summaryMd: text("summary_md").notNull(), 
  citations: json("citations").$type<
    Array<{ sentenceIdx: number; sourceSentenceIdxes: number[] }>
  >().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documentSentences = pgTable("document_sentences", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").notNull(),
  idx: integer("idx").notNull(),
  text: text("text").notNull(),
});

export const jobs = pgTable("jobs", {
  id: text("id").primaryKey(),
  type: varchar("type", { length: 32 }).notNull(),    
  payload: text("payload").notNull(),                  
  status: varchar("status", { length: 16 }).default("queued").notNull(), 
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auth_schema = {users, sessions, accounts, verifications};