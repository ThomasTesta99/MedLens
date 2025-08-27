CREATE TABLE "document_entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"label" varchar(64) NOT NULL,
	"start" integer NOT NULL,
	"end" integer NOT NULL,
	"text" text NOT NULL,
	"confidence" integer,
	"code_system" varchar(32),
	"code" varchar(32)
);
--> statement-breakpoint
CREATE TABLE "document_spans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"page" integer,
	"start" integer NOT NULL,
	"end" integer NOT NULL,
	"snippet" text
);
--> statement-breakpoint
CREATE TABLE "document_summaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"model" varchar(128),
	"prompt_version" varchar(32),
	"summary_markdown" text NOT NULL,
	"suggested_questions" jsonb,
	"citations" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "document_texts" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"language" varchar(8),
	"plain_text" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "source_type" varchar(16);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "ingest_method" varchar(16);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "content_hash" varchar(64);--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "document_entities" ADD CONSTRAINT "document_entities_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_spans" ADD CONSTRAINT "document_spans_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_summaries" ADD CONSTRAINT "document_summaries_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_texts" ADD CONSTRAINT "document_texts_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "file_url";