import { expect, test } from '@playwright/test'
import { signUp, uniqueEmail } from './helpers'

test('área do aluno tem moldura própria, tema escuro e menu recolhível que ficam guardados', async ({ page }) => {
  await signUp(page, 'Aluno Tema', uniqueEmail('tema'))
  await expect(page).toHaveURL(/\/aluno/)

  // Sem o menu da landing page; com o menu próprio
  await expect(page.getByRole('link', { name: 'Benefícios' })).toHaveCount(0)
  const menu = page.getByRole('navigation', { name: 'Área do aluno' }).first()
  await expect(menu.getByRole('link', { name: 'Meus cursos' })).toBeVisible()

  // Tema escuro fica depois de recarregar e não vaza para o site público
  await page.getByRole('radio', { name: 'Escuro' }).click()
  await expect(page.locator('html')).toHaveClass(/dark/)
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)

  // Menu recolhido também fica guardado
  await page.getByRole('button', { name: 'Recolher o menu' }).click()
  await expect(page.getByRole('button', { name: 'Abrir o menu' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Abrir o menu' })).toBeVisible()

  await page.goto('/')
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})
