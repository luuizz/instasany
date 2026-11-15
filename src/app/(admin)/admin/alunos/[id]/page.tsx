import { BookOpenIcon, CheckCircle2Icon, ClockIcon, EyeIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { StatCard } from '@/components/admin/stat-card'
import { ActivityList } from '@/components/admin/students/activity-list'
import { RoleBadge } from '@/components/admin/students/role-badge'
import { RoleForm } from '@/components/admin/students/role-form'
import { StudentCourses } from '@/components/admin/students/student-courses'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { initialsOf } from '@/lib/account'
import { formatDate, formatRelative } from '@/lib/dates'
import { requireAdmin } from '@/server/auth/session'
import { getStudent } from '@/server/services/students'

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const student = await getStudent(decodeURIComponent((await params).id))
  return { title: student?.name || student?.email || 'Aluno' }
}

export default async function StudentPage({ params }: PageProps) {
  const id = decodeURIComponent((await params).id)
  const [admin, student] = await Promise.all([requireAdmin(`/admin/alunos/${id}`), getStudent(id)])
  if (!student) notFound()
  const completed = student.courses.reduce((sum, course) => sum + course.completed, 0)

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { href: '/admin', label: 'Painel' },
          { href: '/admin/alunos', label: 'Alunos' },
        ]}
        title={student.name || student.email}
        badge={<RoleBadge role={student.role} />}
        media={
          <Avatar aria-hidden className="size-16">
            <AvatarFallback className="bg-lime text-xl font-bold text-pine">
              {initialsOf(student.name || student.email)}
            </AvatarFallback>
          </Avatar>
        }
        description={[
          student.email,
          student.createdAt && `cadastro em ${formatDate(student.createdAt)}`,
          student.lastActivity ? `ativo ${formatRelative(student.lastActivity)}` : 'sem atividade ainda',
        ]
          .filter(Boolean)
          .join(' · ')}
      />

      <section aria-label="Resumo" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          featured
          index={0}
          icon={<BookOpenIcon />}
          label="Cursos"
          value={student.courses.length}
          detail="Matrículas ativas"
        />
        <StatCard
          index={1}
          icon={<ClockIcon />}
          label="Minutos de vídeo"
          value={student.watchedMinutes}
          detail="Tempo assistido nas aulas"
        />
        <StatCard
          index={2}
          icon={<EyeIcon />}
          label="Páginas vistas"
          value={student.pageViews}
          detail="Enquanto estava logado"
        />
        <StatCard
          index={3}
          icon={<CheckCircle2Icon />}
          label="Aulas concluídas"
          value={completed}
          detail="Somando todos os cursos"
        />
      </section>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="rounded-3xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Cursos e progresso</CardTitle>
            <CardDescription>Aulas concluídas em cada curso em que está matriculado.</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentCourses courses={student.courses} />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6">
          <Card className="rounded-3xl shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Papel</CardTitle>
              <CardDescription>Admins acessam o painel; alunos só a área do aluno.</CardDescription>
            </CardHeader>
            <CardContent>
              <RoleForm profileId={student.id} role={student.role} isSelf={student.id === admin.id} />
            </CardContent>
          </Card>
          <Card className="rounded-3xl shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Atividade recente</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityList items={student.activity} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
