import 'server-only'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

export class DatabaseConfigError extends Error {}

export const isDatabaseConfigured = () => Boolean(process.env.DATABASE_URL?.startsWith('postgres'))

let instance: NodePgDatabase<typeof schema> | undefined

// Criado sob demanda: sem DATABASE_URL (CI, primeiro `yarn dev`) o site sobe com o conteúdo padrão
export function db() {
  if (instance) return instance
  if (!isDatabaseConfigured()) throw new DatabaseConfigError('DATABASE_URL não configurada.')
  instance = drizzle(new Pool({ connectionString: process.env.DATABASE_URL, max: 5 }), { schema })
  return instance
}
