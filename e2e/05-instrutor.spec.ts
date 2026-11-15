import { expect, test } from '@playwright/test'
import { ADMIN, COURSE, signIn, signUp, toast, uniqueEmail } from './helpers'

test('admin promove a instrutor, que edita o conteúdo dos cursos e mais nada', async ({ browser }) => {
  const email = uniqueEmail('instrutor')
  const instructor = await browser.newPage()
  await signUp(instructor, 'Instrutora Teste', email)

  const admin = await browser.newPage()
  await signIn(admin, ADMIN.email, ADMIN.password)
  await admin.goto(`/admin/alunos?busca=${encodeURIComponent(email)}`)
  await admin.getByText('Instrutora Teste').click()
  await admin.getByLabel('Papel').click()
  await admin.getByRole('option', { name: 'Instrutor' }).click()
  await admin.getByRole('button', { name: 'Salvar papel' }).click()
  await expect(toast(admin)).toContainText('Papel atualizado')

  // Entra de novo: vai direto para os cursos, sem os itens de admin no menu
  await instructor.context().clearCookies()
  await signIn(instructor, email)
  await expect(instructor).toHaveURL(/\/admin\/cursos$/)
  const menu = instructor.getByRole('navigation', { name: 'Painel' }).first()
  await expect(menu.getByRole('link', { name: 'Cursos' })).toBeVisible()
  await expect(menu.getByRole('link', { name: 'Alunos' })).toHaveCount(0)
  await expect(instructor.getByRole('link', { name: 'Novo curso' })).toHaveCount(0)

  await instructor.getByText(COURSE.title).first().click()
  await instructor.getByRole('link', { name: 'Boas-vindas e como estudar' }).click()
  await instructor.getByLabel('Título').fill('Boas-vindas e como estudar (revisada)')
  await instructor.getByRole('button', { name: 'Salvar aula' }).click()
  await expect(toast(instructor)).toBeVisible()

  // Páginas de admin mandam de volta para os cursos
  await instructor.goto('/admin/alunos')
  await expect(instructor).toHaveURL(/\/admin\/cursos$/)
  await instructor.goto('/admin/cursos/novo')
  await expect(instructor).toHaveURL(/\/admin\/cursos$/)
})
