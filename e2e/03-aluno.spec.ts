import { expect, test } from '@playwright/test'
import { COURSE, signUp, toast, uniqueEmail } from './helpers'

test('aluno se matricula, estuda, faz o quiz, pergunta e avalia', async ({ page }) => {
  await signUp(page, 'Aluna Teste', uniqueEmail('aluna'))
  await expect(page).toHaveURL(/\/aluno/)

  await page.goto(`/cursos/${COURSE.slug}`)
  await page.locator('main form button[type=submit]').first().click()
  await expect(page).toHaveURL(/\/aluno\/cursos\/instagram-do-zero\/aulas\/\d+/)

  // Conclui as aulas do módulo 1; a última leva ao quiz
  for (let lesson = 0; lesson < 5 && !page.url().includes('/quiz/'); lesson++) {
    const current = page.url()
    await page.getByRole('button', { name: /^Concluir/ }).click()
    await page.waitForURL((url) => url.toString() !== current)
  }
  await expect(page).toHaveURL(/\/quiz\//)
  await page.getByText('Comprar seguidores').click()
  await page.getByRole('button', { name: 'Enviar respostas' }).click()
  await expect(page.getByText('0 de 1', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Refazer' }).click()
  await page.getByText('Definir o nicho').click()
  await page.getByRole('button', { name: 'Enviar respostas' }).click()
  await expect(page.getByText('1 de 1', { exact: true })).toBeVisible()

  // Dúvida e avaliação na aula seguinte
  await page.getByRole('link', { name: 'Ir para o próximo módulo' }).click()
  await page.getByLabel('Sua dúvida').fill('Quantos posts por semana no começo?')
  await page.getByRole('button', { name: 'Enviar dúvida' }).click()
  await expect(toast(page)).toContainText('Dúvida enviada')
  await expect(page.locator('#duvidas').getByText('Quantos posts por semana no começo?')).toBeVisible()

  await page.locator('#avaliacao').locator('..').locator('label').nth(4).click()
  await page.getByLabel('Comentário').fill('Aulas curtas e práticas.')
  await page.getByRole('button', { name: 'Enviar avaliação' }).click()
  await expect(toast(page)).toContainText('Obrigado')

  await page.goto(`/cursos/${COURSE.slug}`)
  await expect(page.getByText('Aulas curtas e práticas.')).toBeVisible()

  await page.goto('/aluno')
  await expect(page.locator('#continuar')).toBeVisible()
  await page.goto('/aluno/cursos')
  await expect(page.getByRole('heading', { name: 'Meus cursos', level: 1 })).toBeVisible()
  await expect(page.locator('main').getByText(COURSE.title).first()).toBeVisible()
})

test('aluno troca o nome no perfil', async ({ page }) => {
  await signUp(page, 'Nome Antigo', uniqueEmail('perfil'))
  await page.goto('/aluno/perfil')
  await page.getByLabel('Nome').fill('Nome Novo')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(toast(page)).toContainText('Dados salvos')
  await page.reload()
  await expect(page.getByLabel('Nome')).toHaveValue('Nome Novo')
})
