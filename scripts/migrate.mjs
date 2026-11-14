// Aplica as migrations de database/migrations no banco de DATABASE_URL (yarn db:migrate).
// Roda no CI e no deploy; migrations já aplicadas são ignoradas.
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import pg from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('Defina DATABASE_URL para rodar as migrations.')
  process.exit(1)
}

const pool = new pg.Pool({ connectionString: url, max: 1 })
try {
  await migrate(drizzle(pool), { migrationsFolder: 'database/migrations' })
  console.log('Migrations aplicadas.')
} catch (error) {
  console.error('Falha nas migrations:', error)
  process.exitCode = 1
} finally {
  await pool.end()
}
