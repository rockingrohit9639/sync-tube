DO $$ BEGIN
 CREATE TYPE "projectStatus" AS ENUM('ONGOING', 'DONE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"admin" text NOT NULL,
	"deadline" timestamp,
	"isArchive" boolean DEFAULT false,
	"archivedOn" timestamp,
	"projectStatus" "projectStatus",
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects_to_members" (
	"projectId" text NOT NULL,
	"memberId" text NOT NULL,
	CONSTRAINT projects_to_members_projectId_memberId PRIMARY KEY("projectId","memberId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_admin_user_id_fk" FOREIGN KEY ("admin") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_members" ADD CONSTRAINT "projects_to_members_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects_to_members" ADD CONSTRAINT "projects_to_members_memberId_user_id_fk" FOREIGN KEY ("memberId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
