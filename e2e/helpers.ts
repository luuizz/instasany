import fs from 'node:fs'
import path from 'node:path'
import { expect, type Page } from '@playwright/test'

export const ADMIN = { name: 'Admin E2E', email: 'admin@e2e.test', password: 'senha-e2e-123' }
export const PASSWORD = 'senha-e2e-123'
export const COURSE = { slug: 'instagram-do-zero', title: 'Instagram do zero ao primeiro cliente' }

export const uniqueEmail = (prefix: string) => `${prefix}-${Date.now()}@e2e.test`

export async function signUp(page: Page, name: string, email: string, password = PASSWORD) {
  await page.goto('/cadastro')
  await page.getByLabel('Nome', { exact: true }).fill(name)
  await page.getByLabel('E-mail', { exact: true }).fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.locator('main button[type=submit]').click()
  await expect(page).toHaveURL(/\/(aluno|admin)/)
}

export async function signIn(page: Page, email: string, password = PASSWORD) {
  await page.goto('/entrar')
  await page.getByLabel('E-mail', { exact: true }).fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.locator('main button[type=submit]').click()
  await expect(page).toHaveURL(/\/(aluno|admin)/)
}

// Último link de "esqueci a senha" enviado pelo login de teste
export function lastResetLink() {
  const file = path.join(import.meta.dirname, '.output', 'reset-links.txt')
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n').filter(Boolean)
  return lines.at(-1) ?? null
}

export const toast = (page: Page) => page.locator('[data-sonner-toast]').first()
