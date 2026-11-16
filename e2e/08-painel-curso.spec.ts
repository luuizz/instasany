import { expect, test } from '@playwright/test'
import { ADMIN, signIn, toast } from './helpers'

test('admin cria um curso do zero com módulo e aula', async ({ page }) => {
  const title = `Curso E2E ${Date.now()}`
  await signIn(page, ADMIN.email, ADMIN.password)

  await page.goto('/admin/cursos/novo')
  await page.getByLabel('Nome do curso').fill(title)
  await page.getByLabel('Resumo').fill('Curso criado pelo teste de ponta a ponta.')
  await page.getByRole('button', { name: 'Criar curso' }).click()
  await expect(page).toHaveURL(/\/admin\/cursos\/\d+$/)
  await expect(page.getByRole('heading', { name: title })).toBeVisible()

  await page.getByPlaceholder('Nome do módulo').last().fill('Módulo do teste')
  await page.getByRole('button', { name: 'Adicionar' }).click()
  // O módulo novo aparece com o campo de renomear já preenchido e o botão de nova aula
  await expect(page.getByRole('textbox', { name: 'Nome do módulo' }).first()).toHaveValue('Módulo do teste')
  await page.getByRole('button', { name: 'Nova aula' }).first().click()
  await expect(page).toHaveURL(/\/aulas\/\d+$/)
  await page.getByLabel('Título').fill('Aula do teste')
  await page.getByRole('button', { name: 'Salvar aula' }).click()
  await expect(toast(page)).toBeVisible()

  await page.goto('/admin/cursos')
  await expect(page.getByText(title)).toBeVisible()
})
