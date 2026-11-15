import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ActionsMenu } from '@/components/admin/actions-menu'
import { PageHeader } from '@/components/admin/page-header'
import { QuizEditor } from '@/components/admin/quiz/quiz-editor'
import { StatusBadge } from '@/components/admin/status-badge'
import { getCourseById } from '@/server/services/courses'
import { getQuizDraft } from '@/server/services/quiz'
import { deleteQuizAction, saveQuizAction } from '../../../../quiz-actions'

export const metadata: Metadata = { title: 'Quiz do módulo' }

type PageProps = { params: Promise<{ id: string; modulo: string }> }

export default async function ModuleQuizPage({ params }: PageProps) {
  const { id, modulo } = await params
  const course = await getCourseById(Number(id))
  const moduleIndex = course?.modules.findIndex((item) => item.id === Number(modulo)) ?? -1
  const courseModule = course?.modules[moduleIndex]
  if (!course || !courseModule) notFound()
  const draft = await getQuizDraft(courseModule.id)

  return (
    <div className="max-w-3xl">
      <PageHeader
        breadcrumbs={[
          { href: '/admin', label: 'Painel' },
          { href: '/admin/cursos', label: 'Cursos' },
          { href: `/admin/cursos/${course.id}`, label: course.title },
        ]}
        title={`Quiz do módulo ${moduleIndex + 1}`}
        badge={
          <StatusBadge tone={draft ? 'live' : 'muted'}>
            {draft ? `${draft.questions.length} perguntas` : 'Novo'}
          </StatusBadge>
        }
        description={`${courseModule.title}. O aluno faz o quiz depois das aulas do módulo e precisa passar nele para receber o certificado.`}
        actions={
          draft ? (
            <ActionsMenu
              links={[]}
              danger={{
                label: 'Excluir quiz',
                title: 'Excluir o quiz deste módulo?',
                description: 'As perguntas e as tentativas dos alunos também saem. Não dá para desfazer.',
                run: deleteQuizAction.bind(null, courseModule.id, course.id),
              }}
            />
          ) : undefined
        }
      />
      <QuizEditor initial={draft} save={saveQuizAction.bind(null, courseModule.id, course.id)} />
    </div>
  )
}
