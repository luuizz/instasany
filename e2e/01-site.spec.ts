import { expect, test } from '@playwright/test'

test.describe('site público', () => {
  test('home abre e não rola para o lado no celular', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await expect(page.locator('h1').first()).toBeVisible()
    const width = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(width).toBeLessThanOrEqual(390)
  })

  test('privacidade e 404', async ({ page }) => {
    await page.goto('/privacidade')
    await expect(page.getByRole('heading', { name: 'O que medimos e por quê' })).toBeVisible()
    const response = await page.goto('/pagina-que-nao-existe')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
  })

  test('áreas logadas pedem login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/entrar\?volta=%2Fadmin/)
    await page.goto('/aluno')
    await expect(page).toHaveURL(/\/entrar/)
  })
})
