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
    await expect(page.getByRole('heading', { name: 'Essa página saiu do feed' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ver os cursos' })).toBeVisible()

    const course = await page.goto('/cursos/curso-que-nao-existe')
    expect(course?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Não achamos essa página' })).toBeVisible()
  })

  test('áreas logadas pedem login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/entrar\?volta=%2Fadmin/)
    await page.goto('/aluno')
    await expect(page).toHaveURL(/\/entrar/)
  })
})
