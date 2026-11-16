import {
  ArrowRightIcon,
  CheckCircle2Icon,
  FilePenLineIcon,
  MessageCircleQuestionIcon,
  UserRoundXIcon,
} from 'lucide-react'
import Link from 'next/link'
import { countLabel } from '@/lib/duration'
import type { DashboardAttention } from '@/server/services/dashboard'

// Pendências da equipe, cada uma levando para onde se resolve
export function AttentionList({ attention }: { attention: DashboardAttention }) {
  const items = [
    attention.unansweredQuestions > 0 && {
      href: '/admin/duvidas',
      icon: MessageCircleQuestionIcon,
      title: countLabel(attention.unansweredQuestions, 'dúvida sem resposta', 'dúvidas sem resposta'),
      detail: 'Alunos esperando a equipe',
    },
    attention.idleStudents > 0 && {
      href: '/admin/alunos',
      icon: UserRoundXIcon,
      title: countLabel(attention.idleStudents, 'aluno parado', 'alunos parados'),
      detail: 'Curso em andamento e nada há mais de 7 dias',
    },
    attention.draftCourses > 0 && {
      href: '/admin/cursos',
      icon: FilePenLineIcon,
      title: countLabel(attention.draftCourses, 'curso em rascunho', 'cursos em rascunho'),
      detail: 'Ainda não aparecem no site',
    },
  ].filter((item) => item !== false)

  return (
    <section aria-labelledby="atencao" className="rounded-3xl border border-border bg-card p-6">
      <h2 id="atencao" className="text-lg font-semibold">
        Precisa de atenção
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2Icon className="size-4 text-sage" />
          Tudo em dia por aqui.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map(({ href, icon: Icon, title, detail }) => (
            <li key={href}>
              <Link href={href} className="group flex items-center gap-3 rounded-2xl p-3 transition hover:bg-secondary">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-lime/40 text-pine">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-xs text-muted-foreground">{detail}</span>
                </span>
                <ArrowRightIcon className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
