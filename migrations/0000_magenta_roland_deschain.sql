CREATE TYPE "public"."role" AS ENUM('PATIENT', 'CAREGIVER', 'CLINICIAN', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('UPLOADED', 'PROCESSING', 'READY', 'ERROR');--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'PATIENT' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
