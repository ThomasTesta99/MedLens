CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" varchar(256),
	"file_url" text NOT NULL,
	"page_count" integer DEFAULT 0,
	"status" "status" DEFAULT 'UPLOADED' NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT now()
);
