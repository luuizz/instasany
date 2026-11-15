import { expect, test } from '@playwright/test'
import { lastResetLink, signIn, signUp, uniqueEmail } from './helpers'

test('esqueci a senha: pedir o link, criar uma senha nova e entrar', async ({ page, context }) => {
  const email = uniqueEmail('senha')
  await signUp(page, 'Senha Esquecida', email)
  await context.clearCookies()

  await page.goto('/entrar')
  await page.getByRole('link', { name: 'Esqueci a senha' }).click()
  await page.getByLabel('E-mail da conta').fill(email)
  await page.locator('main button[type=submit]').click()
  await expect(page.getByText('Se houver uma conta com este e-mail')).toBeVisible()

  await expect.poll(lastResetLink).toBeTruthy()
  await page.goto(lastResetLink() as string)
  await expect(page).toHaveURL(/\/redefinir-senha\?token=/)
  await page.getByLabel('Senha nova', { exact: true }).fill('outra-senha-123')
  await page.getByLabel('Repita a senha nova').fill('outra-senha-123')
  await page.locator('main button[type=submit]').click()
  await expect(page).toHaveURL(/\/entrar\?senha=nova/)

  await signIn(page, email, 'outra-senha-123')
  await expect(page).toHaveURL(/\/aluno/)
})
