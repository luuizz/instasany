// Servidor de login para os testes: o mesmo Better Auth que roda por trás do Neon Auth,
// no endereço que o app espera em NEON_AUTH_BASE_URL. Links de "esqueci a senha" vão para um arquivo.
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { betterAuth } from 'better-auth'
import { getMigrations } from 'better-auth/db/migration'
import { toNodeHandler } from 'better-auth/node'
import { jwt } from 'better-auth/plugins'
import pg from 'pg'

const adminUrl = process.env.E2E_POSTGRES_URL ?? 'postgres://postgres:postgres@localhost:5432/postgres'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3200'
export const RESET_LINKS = path.join(import.meta.dirname, '.output', 'reset-links.txt')

// Banco próprio do login, recriado a cada execução
const admin = new pg.Client({ connectionString: adminUrl })
await admin.connect()
await admin.query('drop database if exists e2e_auth with (force)')
await admin.query('create database e2e_auth')
await admin.end()

fs.mkdirSync(path.dirname(RESET_LINKS), { recursive: true })
fs.writeFileSync(RESET_LINKS, '')

const authUrl = new URL(adminUrl)
authUrl.pathname = '/e2e_auth'

const auth = betterAuth({
  database: new pg.Pool({ connectionString: authUrl.toString() }),
  baseURL: 'http://127.0.0.1:4100',
  basePath: '/neondb/auth',
  secret: 'e2e-secret-0123456789-0123456789-0123',
  trustedOrigins: [siteUrl],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ url }) => fs.appendFileSync(RESET_LINKS, `${url}\n`),
  },
  advanced: {
    database: { generateId: 'uuid' },
    cookiePrefix: 'neon-auth',
    useSecureCookies: true,
    defaultCookieAttributes: { sameSite: 'none', secure: true },
  },
  plugins: [jwt({ jwks: { keyPairConfig: { alg: 'RS256' } } })],
})

const { runMigrations } = await getMigrations(auth.options)
await runMigrations()
http.createServer(toNodeHandler(auth)).listen(4100, '127.0.0.1', () => console.log('login de teste em :4100'))
