import {
  bigserial,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['student', 'admin'])

// Perfil da plataforma. O id é o do usuário no Neon Auth (a senha e a sessão ficam lá).
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull().default(''),
  role: roleEnum('role').notNull().default('student'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// CMS: uma linha por seção do site; o formato de `data` é validado pelo schema da seção
export const siteSections = pgTable('site_sections', {
  key: text('key').primaryKey(),
  data: jsonb('data').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text('updated_by').references(() => profiles.id, { onDelete: 'set null' }),
})

export type ProfileRow = typeof profiles.$inferSelect
export type SiteSectionRow = typeof siteSections.$inferSelect

// ---- LMS ------------------------------------------------------------------

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  summary: text('summary').notNull().default(''),
  description: text('description').notNull().default(''),
  coverUrl: text('cover_url'),
  level: text('level').notNull().default('Iniciante'),
  published: boolean('published').notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const courseModules = pgTable(
  'course_modules',
  {
    id: serial('id').primaryKey(),
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [index('course_modules_course_idx').on(table.courseId, table.sortOrder)],
)

export const lessons = pgTable(
  'lessons',
  {
    id: serial('id').primaryKey(),
    moduleId: integer('module_id')
      .notNull()
      .references(() => courseModules.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    // Texto da aula; parágrafos separados por linha em branco
    content: text('content').notNull().default(''),
    videoUrl: text('video_url'),
    durationMinutes: integer('duration_minutes').notNull().default(0),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('lessons_module_idx').on(table.moduleId, table.sortOrder)],
)

export const enrollments = pgTable(
  'enrollments',
  {
    profileId: text('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.courseId] })],
)

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    profileId: text('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.lessonId] })],
)

export type CourseRow = typeof courses.$inferSelect
export type CourseModuleRow = typeof courseModules.$inferSelect
export type LessonRow = typeof lessons.$inferSelect

// ---- Análise de uso ---------------------------------------------------------

// Eventos próprios de uso (sem serviço de terceiros). visitor_id é um id aleatório guardado
// no navegador, sem IP nem user agent; profile_id só existe quando a pessoa está logada.
export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    type: text('type').notNull(),
    visitorId: text('visitor_id'),
    profileId: text('profile_id').references(() => profiles.id, { onDelete: 'set null' }),
    path: text('path'),
    courseId: integer('course_id').references(() => courses.id, { onDelete: 'set null' }),
    lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'set null' }),
    seconds: integer('seconds').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('analytics_events_created_idx').on(table.createdAt, table.type),
    index('analytics_events_profile_idx').on(table.profileId, table.createdAt),
    index('analytics_events_lesson_idx').on(table.lessonId),
  ],
)

export type AnalyticsEventRow = typeof analyticsEvents.$inferSelect
