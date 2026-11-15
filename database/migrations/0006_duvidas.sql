CREATE TABLE "lesson_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"profile_id" text NOT NULL,
	"parent_id" integer,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lesson_questions" ADD CONSTRAINT "lesson_questions_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_questions" ADD CONSTRAINT "lesson_questions_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_questions" ADD CONSTRAINT "lesson_questions_parent_id_lesson_questions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lesson_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lesson_questions_lesson_idx" ON "lesson_questions" USING btree ("lesson_id","created_at");--> statement-breakpoint
CREATE INDEX "lesson_questions_parent_idx" ON "lesson_questions" USING btree ("parent_id");