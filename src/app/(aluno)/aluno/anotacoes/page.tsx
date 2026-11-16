import { NotebookPenIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { NotesList } from '@/components/student/notes-list'
import { StudentPageHeader } from '@/components/student/student-page-header'
import { ButtonLink } from '@/components/ui/button'
import { requireUser } from '@/server/auth/session'
import { listNotes } from '@/server/services/notes'

export const metadata: Metadata = { title: 'Minhas anotações' }

export default async function NotesPage() {
  const profile = await requireUser('/aluno/anotacoes')
  const notes = await listNotes(profile.id)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <StudentPageHeader
        eyebrow="Área do aluno"
        title="Minhas anotações"
        description="Tudo o que você anotou nas aulas, reunido por curso. Só você vê."
      />
      {notes.length ? (
        <NotesList notes={notes} />
      ) : (
        <section className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-14 text-center ring-1 ring-border">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-pine dark:text-lime">
            <NotebookPenIcon className="size-7" />
          </span>
          <h2 className="text-2xl font-semibold text-ink">Nenhuma anotação ainda</h2>
          <p className="max-w-md text-ink/60">
            Embaixo de cada aula tem um bloco de notas. O que você escrever lá aparece aqui, salvo sozinho.
          </p>
          <ButtonLink href="/aluno/cursos" size="default">
            Ir para meus cursos
          </ButtonLink>
        </section>
      )}
    </div>
  )
}
