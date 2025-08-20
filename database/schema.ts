import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar} from "drizzle-orm/pg-core";

export const ROLE_ENUM = pgEnum("role", ["PATIENT", "CAREGIVER", "CLINICIAN", "ADMIN"]);
export const STATUS_ENUM = pgEnum("status", ["UPLOADED", "PROCESSING", "READY", "ERROR"])

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", {length: 255}).notNull().unique(),
    role: ROLE_ENUM("role").notNull().default("PATIENT"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").notNull(),
    title: varchar("title", {length: 256}),
    fileUrl: text("file_url").notNull(),
    pageCount: integer("page_count").default(0),
    status: STATUS_ENUM("status").notNull().default("UPLOADED"),
    error: text("error"),
    createdAt: timestamp("created_at").defaultNow(),
})