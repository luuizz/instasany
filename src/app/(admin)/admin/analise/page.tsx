import { CheckCircle2Icon, ClockIcon, EyeIcon, GraduationCapIcon, MousePointerClickIcon, UsersIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { DailyChart } from '@/components/admin/analytics/daily-chart'
import { FunnelSteps } from '@/components/admin/analytics/funnel-steps'
import { LessonsTable } from '@/components/admin/analytics/lessons-table'
import { PeriodTabs } from '@/components/admin/analytics/period-tabs'
import { RankedBars } from '@/components/admin/analytics/ranked-bars'
import { PageHeader } from '@/components/admin/page-header'
import { StatCard } from '@/components/admin/stat-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { parsePeriod } from '@/lib/analytics'
import { requireAdmin } from '@/server/auth/session'
import { getAnalyticsReport } from '@/server/services/analytics-report'

export const metadata: Metadata = { title: 'Análise' }

type PageProps = { searchParams: Promise<{ periodo?: string | string[] }> }

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-3xl shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default async function AnalyticsPage({ searchParams }: PageProps) {
  await requireAdmin('/admin/analise')
  const period = parsePeriod([(await searchParams).periodo].flat()[0])
  const report = await getAnalyticsReport(period)
  const { totals } = report

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: '/admin', label: 'Painel' }]}
        title="Análise"
        description="Uso do site e das aulas medido pela própria plataforma, sem cookies de terceiros. Acessos de admins não entram."
        actions={<PeriodTabs current={period} />}
      />

      <section aria-label="Números do período" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          featured
          index={0}
          icon={<UsersIcon />}
          label="Visitantes"
          value={totals.visitors}
          detail="Navegadores únicos"
        />
        <StatCard
          index={1}
          icon={<EyeIcon />}
          label="Páginas vistas"
          value={totals.pageViews}
          detail="Site e área do aluno"
        />
        <StatCard
          index={2}
          icon={<MousePointerClickIcon />}
          label="Alunos ativos"
          value={totals.activeStudents}
          detail="Fizeram algo logados"
        />
        <StatCard
          index={3}
          icon={<ClockIcon />}
          label="Minutos de vídeo"
          value={totals.watchedMinutes}
          detail="Tempo assistido nas aulas"
        />
        <StatCard
          index={4}
          icon={<GraduationCapIcon />}
          label="Matrículas"
          value={totals.enrollments}
          detail="Novas no período"
        />
        <StatCard
          index={5}
          icon={<CheckCircle2Icon />}
          label="Aulas concluídas"
          value={totals.completions}
          detail="Marcadas pelos alunos"
        />
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <Panel
          title="Páginas vistas por dia"
          description={`Últimos ${period} dias. Passe o mouse numa barra para ver o dia.`}
        >
          <DailyChart points={report.daily} />
        </Panel>
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
          <Panel title="Da visita à aula" description="Quantas pessoas chegaram a cada etapa no período.">
            <FunnelSteps steps={report.funnel} />
          </Panel>
          <Panel title="Páginas mais vistas" description="Endereços com mais acessos no período.">
            <RankedBars items={report.topPages} empty="Nenhuma página vista no período." />
          </Panel>
        </div>
        <Panel title="Aulas com mais engajamento" description="Ordenadas pelo tempo assistido.">
          <LessonsTable lessons={report.lessons} />
        </Panel>
      </div>
    </>
  )
}
