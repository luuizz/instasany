import { AwardIcon, DownloadIcon, GraduationCapIcon, PercentIcon, StarIcon, UsersIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { CourseStudentsTable } from '@/components/admin/report/course-students-table'
import { LessonFunnel } from '@/components/admin/report/lesson-funnel'
import { QuizReport } from '@/components/admin/report/quiz-report'
import { StatCard } from '@/components/admin/stat-card'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireStaff } from '@/server/auth/session'
import { getCourseReport } from '@/server/services/course-report'
import { getCourseById } from '@/server/services/courses'

type PageProps = { params: Promise<{ id: string }> }

export const metadata: Metadata = { title: 'Relatório do curso' }

// Relatório de um curso: quantos entram, quantos terminam, onde param e como vão nos quizzes
export default async function CourseReportPage({ params }: PageProps) {
  const id = Number((await params).id)
  await requireStaff()
  const course = Number.isInteger(id) ? await getCourseById(id) : null
  if (!course) notFound()
  const report = await getCourseReport(course.id)
  const completion = report.enrolled ? Math.round((report.finished / report.enrolled) * 100) : 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { href: '/admin', label: 'Painel' },
          { href: '/admin/cursos', label: 'Cursos' },
          { href: `/admin/cursos/${course.id}`, label: course.title },
        ]}
        title="Relatório"
        description={`Como os alunos estão indo em ${course.title}.`}
        actions={
          <a
            href={`/admin/cursos/${course.id}/relatorio/csv`}
            download
            className={buttonVariants({ variant: 'outline', size: 'default' })}
          >
            <DownloadIcon />
            Baixar alunos (CSV)
          </a>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          index={0}
          featured
          icon={<UsersIcon />}
          label="Matriculados"
          value={report.enrolled}
          detail={`${report.enrolledLast30} nos últimos 30 dias`}
        />
        <StatCard
          index={1}
          icon={<GraduationCapIcon />}
          label="Concluíram"
          value={report.finished}
          detail={`${completion}% dos matriculados`}
        />
        <StatCard
          index={2}
          icon={<PercentIcon />}
          label="Progresso médio (%)"
          value={report.averageProgress}
          detail="Média das aulas concluídas por aluno"
        />
        <StatCard
          index={3}
          icon={report.rating.count ? <StarIcon /> : <AwardIcon />}
          label={report.rating.count ? 'Avaliações' : 'Certificados'}
          value={report.rating.count || report.certificates}
          detail={
            report.rating.count
              ? `Nota média ${report.rating.average.toFixed(1).replace('.', ',')} · ${report.certificates} certificados`
              : 'Emitidos neste curso'
          }
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="rounded-3xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Onde os alunos param</CardTitle>
            <CardDescription>Quantos matriculados concluíram cada aula, na ordem do curso.</CardDescription>
          </CardHeader>
          <CardContent>
            <LessonFunnel items={report.funnel} />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-6">
          <Card className="rounded-3xl shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Quizzes</CardTitle>
              <CardDescription>
                Aprovação conta cada aluno uma vez; a média considera todas as tentativas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizReport items={report.quizzes} />
            </CardContent>
          </Card>
          <Card className="rounded-3xl shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Alunos</CardTitle>
              <CardDescription>Do mais ativo para o menos ativo.</CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStudentsTable students={report.students} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
