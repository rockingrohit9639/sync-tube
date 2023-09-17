DO $$ BEGIN
 CREATE TYPE "videoStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUIRED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"videoStatus" "videoStatus",
	"seenByAdmin" boolean DEFAULT false,
	"url" text NOT NULL,
	"uploadedBy" text NOT NULL,
	"projectId" integer NOT NULL,
	"uploadedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "videos" ADD CONSTRAINT "videos_uploadedBy_user_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "videos" ADD CONSTRAINT "videos_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
