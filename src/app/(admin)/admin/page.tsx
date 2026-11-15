import {
  BookOpenIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  PanelsTopLeftIcon,
  PlayCircleIcon,
  UsersIcon,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { RecentEnrollments } from '@/components/admin/recent-enrollments'
import { StatCard } from '@/components/admin/stat-card'
import { countLabel } from '@/lib/duration'
import { requireAdmin } from '@/server/auth/session'
import { getDashboardStats, listRecentEnrollments } from '@/server/services/dashboard'

export const metadata: Metadata = { title: 'Visão geral' }

const shortcuts = [
  {
    href: '/admin/cursos/novo',
    label: 'Criar um curso',
    detail: 'Módulos, aulas e vídeos',
    icon: <GraduationCapIcon />,
  },
  {
    href: '/admin/conteudo',
    label: 'Editar o site',
    detail: 'Textos, planos e perguntas da home',
    icon: <PanelsTopLeftIcon />,
  },
]

export default async function AdminDashboardPage() {
  const [profile, stats, recent] = await Promise.all([requireAdmin(), getDashboardStats(), listRecentEnrollments()])
  const firstName = profile.name.split(' ')[0] || 'admin'

  return (
    <>
      <PageHeader title={`Olá, ${firstName}!`} description="Como está a Instasany hoje." />

      <section aria-label="Números" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          featured
          index={0}
          icon={<UsersIcon />}
          label="Alunos"
          value={stats.students}
          detail={`${countLabel(stats.enrollmentsLastWeek, 'matrícula', 'matrículas')} nos últimos 7 dias`}
        />
        <StatCard
          index={1}
          icon={<BookOpenIcon />}
          label="Cursos publicados"
          value={stats.publishedCourses}
          detail={stats.draftCourses ? `${stats.draftCourses} em rascunho` : 'Nenhum rascunho'}
        />
        <StatCard
          index={2}
          icon={<PlayCircleIcon />}
          label="Aulas"
          value={stats.lessons}
          detail={`${countLabel(stats.enrollments, 'matrícula', 'matrículas')} no total`}
        />
        <StatCard
          index={3}
          icon={<CheckCircle2Icon />}
          label="Aulas concluídas"
          value={stats.completedLessons}
          detail="Somando todos os alunos"
        />
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <RecentEnrollments enrollments={recent} />
        <section aria-labelledby="atalhos" className="flex flex-col gap-4">
          <h2 id="atalhos" className="text-lg font-semibold">
            Atalhos
          </h2>
          {shortcuts.map((shortcut, index) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              style={{ animationDelay: `${200 + index * 60}ms` }}
              className="group flex animate-in items-center gap-4 rounded-3xl border border-border p-5 transition duration-500 fill-mode-both fade-in slide-in-from-bottom-3 hover:-translate-y-0.5 hover:border-sage hover:shadow-lg"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-pine transition group-hover:bg-lime [&_svg]:size-5">
                {shortcut.icon}
              </span>
              <span>
                <span className="block font-semibold">{shortcut.label}</span>
                <span className="block text-sm text-muted-foreground">{shortcut.detail}</span>
              </span>
            </Link>
          ))}
        </section>
      </div>
    </>
  )
}
