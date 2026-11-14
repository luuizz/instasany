import { jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

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
