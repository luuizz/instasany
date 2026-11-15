import {
  type AnyPgColumn,
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
  uniqueIndex,
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

// Onde a pessoa parou no vídeo de cada aula, para continuar dali
export const lessonPositions = pgTable(
  'lesson_positions',
  {
    profileId: text('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    seconds: integer('seconds').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.lessonId] })],
)

// Arquivos de apoio da aula (PDF, planilha, modelo), guardados no Vercel Blob
export const lessonAttachments = pgTable(
  'lesson_attachments',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    url: text('url').notNull(),
    sizeBytes: integer('size_bytes').notNull().default(0),
    contentType: text('content_type').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('lesson_attachments_lesson_idx').on(table.lessonId, table.sortOrder)],
)

// ---- Avaliação ---------------------------------------------------------------

// Um quiz por módulo; quem acerta passPercent% das perguntas é aprovado
export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id')
    .notNull()
    .unique()
    .references(() => courseModules.id, { onDelete: 'cascade' }),
  passPercent: integer('pass_percent').notNull().default(70),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

// Pergunta de múltipla escolha; options é a lista de alternativas, correctIndex a certa
export const quizQuestions = pgTable(
  'quiz_questions',
  {
    id: serial('id').primaryKey(),
    quizId: integer('quiz_id')
      .notNull()
      .references(() => quizzes.id, { onDelete: 'cascade' }),
    prompt: text('prompt').notNull(),
    options: jsonb('options').$type<string[]>().notNull(),
    correctIndex: integer('correct_index').notNull(),
    explanation: text('explanation').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
  },
  (table) => [index('quiz_questions_quiz_idx').on(table.quizId, table.sortOrder)],
)

export const quizAttempts = pgTable(
  'quiz_attempts',
  {
    id: serial('id').primaryKey(),
    profileId: text('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    quizId: integer('quiz_id')
      .notNull()
      .references(() => quizzes.id, { onDelete: 'cascade' }),
    score: integer('score').notNull(),
    total: integer('total').notNull(),
    passed: boolean('passed').notNull(),
    answers: jsonb('answers').$type<number[]>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('quiz_attempts_profile_idx').on(table.profileId, table.quizId)],
)

// Certificado de conclusão; nome, curso e carga ficam gravados como estavam na emissão
export const certificates = pgTable(
  'certificates',
  {
    id: serial('id').primaryKey(),
    code: text('code').notNull().unique(),
    profileId: text('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    studentName: text('student_name').notNull(),
    courseTitle: text('course_title').notNull(),
    totalMinutes: integer('total_minutes').notNull().default(0),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('certificates_profile_course_idx').on(table.profileId, table.courseId)],
)

// Nota de 1 a 5 e comentário opcional; uma avaliação por aluno e curso
export const courseReviews = pgTable(
  'course_reviews',
  {
    profileId: text('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    courseId: integer('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    comment: text('comment').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.courseId] }),
    index('course_reviews_course_idx').on(table.courseId),
  ],
)

// ---- Comunicação ------------------------------------------------------------

// Dúvidas da aula: a pergunta abre a conversa (parent_id nulo) e as respostas apontam para ela
export const lessonQuestions = pgTable(
  'lesson_questions',
  {
    id: serial('id').primaryKey(),
    lessonId: integer('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    profileId: text('profile_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    parentId: integer('parent_id').references((): AnyPgColumn => lessonQuestions.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('lesson_questions_lesson_idx').on(table.lessonId, table.createdAt),
    index('lesson_questions_parent_idx').on(table.parentId),
  ],
)

export type CourseRow = typeof courses.$inferSelect
export type CourseModuleRow = typeof courseModules.$inferSelect
export type LessonRow = typeof lessons.$inferSelect
export type LessonAttachmentRow = typeof lessonAttachments.$inferSelect

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
