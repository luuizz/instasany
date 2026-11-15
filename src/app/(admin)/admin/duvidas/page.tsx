import { ExternalLinkIcon, MessageCircleQuestionIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { StatusBadge } from '@/components/admin/status-badge'
import { QuestionThread } from '@/components/questions/question-thread'
import { cn } from '@/lib/utils'
import { requireAdmin } from '@/server/auth/session'
import { listQuestionsForAdmin } from '@/server/services/questions'

export const metadata: Metadata = { title: 'Dúvidas' }

type PageProps = { searchParams: Promise<{ filtro?: string }> }

const tabs = [
  { value: 'pendentes', label: 'Sem resposta' },
  { value: 'todas', label: 'Todas' },
] as const

export default async function AdminQuestionsPage({ searchParams }: PageProps) {
  const admin = await requireAdmin('/admin/duvidas')
  const filter = (await searchParams).filtro === 'todas' ? 'todas' : 'pendentes'
  const questions = await listQuestionsForAdmin(admin.id, filter === 'pendentes')

  return (
    <div className="max-w-4xl">
      <PageHeader
        breadcrumbs={[{ href: '/admin', label: 'Painel' }]}
        title="Dúvidas"
        description="Perguntas dos alunos nas aulas. As que ainda não têm resposta da equipe aparecem primeiro."
        actions={
          <nav aria-label="Filtro" className="flex gap-1 rounded-full bg-muted p-1">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                href={tab.value === 'pendentes' ? '/admin/duvidas' : '/admin/duvidas?filtro=todas'}
                aria-current={tab.value === filter ? 'page' : undefined}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition',
                  tab.value === filter ? 'bg-card text-pine shadow-sm' : 'text-muted-foreground hover:text-ink',
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        }
      />
      {questions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-12 text-center">
          <MessageCircleQuestionIcon className="size-8 text-muted-foreground" />
          <p className="font-semibold">
            {filter === 'pendentes' ? 'Nenhuma dúvida esperando resposta' : 'Nenhuma dúvida ainda'}
          </p>
          <p className="text-sm text-muted-foreground">As perguntas feitas nas aulas aparecem aqui.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {questions.map((question) => (
            <li key={question.id} className="rounded-3xl border border-border bg-card p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                <Link
                  href={`/aluno/cursos/${question.courseSlug}/aulas/${question.lessonId}#duvidas`}
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-pine"
                >
                  {question.courseTitle} › <span className="font-medium text-ink">{question.lessonTitle}</span>
                  <ExternalLinkIcon className="size-3.5" />
                </Link>
                <StatusBadge tone={question.answered ? 'live' : 'muted'}>
                  {question.answered ? 'Respondida' : 'Sem resposta'}
                </StatusBadge>
              </div>
              <QuestionThread
                thread={question}
                slug={question.courseSlug}
                lessonId={question.lessonId}
                isStaff
                replyOpen={!question.answered}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
