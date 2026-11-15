CREATE TABLE "analytics_events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"visitor_id" text,
	"profile_id" text,
	"path" text,
	"course_id" integer,
	"lesson_id" integer,
	"seconds" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_events_created_idx" ON "analytics_events" USING btree ("created_at","type");--> statement-breakpoint
CREATE INDEX "analytics_events_profile_idx" ON "analytics_events" USING btree ("profile_id","created_at");--> statement-breakpoint
CREATE INDEX "analytics_events_lesson_idx" ON "analytics_events" USING btree ("lesson_id");