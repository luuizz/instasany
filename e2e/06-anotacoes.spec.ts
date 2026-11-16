import { expect, test } from '@playwright/test'
import { COURSE, signUp, uniqueEmail } from './helpers'

test('aluno anota na aula e encontra a anotação em Minhas anotações', async ({ page }) => {
  await signUp(page, 'Aluno Notas', uniqueEmail('notas'))
  await page.goto(`/aluno/explorar/${COURSE.slug}`)
  await page.getByRole('button', { name: 'Matricular-se grátis' }).click()
  await expect(page).toHaveURL(/\/aluno\/cursos\/instagram-do-zero\/aulas\/\d+/)
  const lessonUrl = page.url()

  const notes = page.getByPlaceholder(/Anote ideias/)
  await notes.fill('Testar a bio nova na sexta.')
  await expect(page.locator('#anotacoes-status')).toContainText('Salvo às')

  await page.reload()
  await expect(page.getByPlaceholder(/Anote ideias/)).toHaveValue('Testar a bio nova na sexta.')

  await page.goto('/aluno/anotacoes')
  await expect(page.getByText('Testar a bio nova na sexta.')).toBeVisible()
  await page.getByRole('link', { name: 'Abrir a aula' }).click()
  await expect(page).toHaveURL(lessonUrl)
})
