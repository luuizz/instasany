import { expect, test } from '@playwright/test'
import { ADMIN, COURSE, signIn, signUp, toast } from './helpers'

test.describe.configure({ mode: 'serial' })

test('admin cria a conta, os cursos de exemplo e um quiz', async ({ page }) => {
  // O primeiro acesso de ADMIN_EMAILS vira admin
  await signUp(page, ADMIN.name, ADMIN.email, ADMIN.password).catch(() => signIn(page, ADMIN.email, ADMIN.password))
  await expect(page).toHaveURL(/\/admin/)

  await page.goto('/admin/cursos')
  const demo = page.getByRole('button', { name: 'Criar cursos de exemplo' })
  if (await demo.isVisible()) await demo.click()
  await expect(page.getByText(COURSE.title).first()).toBeVisible()

  await page.getByText(COURSE.title).first().click()
  await expect(page.getByRole('heading', { name: COURSE.title })).toBeVisible()
  await page.getByRole('link', { name: 'Criar quiz' }).first().click()
  await expect(page.getByRole('heading', { name: 'Quiz do módulo 1' })).toBeVisible()

  const question = page.locator('section', { has: page.getByRole('heading', { name: 'Pergunta 1' }) })
  await question.locator('textarea').first().fill('O que vem primeiro?')
  await question.getByLabel('Alternativa A', { exact: true }).fill('Definir o nicho')
  await question.getByLabel('Alternativa B', { exact: true }).fill('Comprar seguidores')
  await question.getByLabel('Alternativa C', { exact: true }).fill('Postar sem tema')
  await page.getByRole('button', { name: 'Salvar quiz' }).click()
  await expect(toast(page)).toContainText('Quiz salvo')
})
