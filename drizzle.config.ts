import { defineConfig } from 'drizzle-kit'

// Gera as migrations SQL a partir do schema (yarn db:generate). Elas são versionadas e
// aplicadas por scripts/migrate.mjs; nunca edite uma migration que já foi aplicada.
export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './database/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL ?? '' },
})
