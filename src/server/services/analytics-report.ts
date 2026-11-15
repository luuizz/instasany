import 'server-only'
import { sql } from 'drizzle-orm'
import type { AnalyticsPeriod } from '@/lib/analytics'
import type { AnalyticsReport, AnalyticsTotals } from '@/types/analytics'
import { num, rawRows, str } from '../db/raw'

const TIME_ZONE = 'America/Sao_Paulo'

// Início do primeiro dia do período, no fuso do Brasil
const periodStart = (days: AnalyticsPeriod) =>
  sql`((((now() at time zone ${TIME_ZONE})::date - ${days - 1}::int)::timestamp) at time zone ${TIME_ZONE})`

async function totals(days: AnalyticsPeriod): Promise<AnalyticsTotals> {
  const [row = {}] = await rawRows(sql`
    select
      count(distinct visitor_id) filter (where type = 'page_view') as visitors,
      count(*) filter (where type = 'page_view') as page_views,
      count(distinct profile_id) as active_students,
      coalesce(sum(seconds) filter (where type = 'video_watch'), 0) as watched,
      count(*) filter (where type = 'enrollment') as enrollments,
      count(*) filter (where type = 'lesson_complete') as completions
    from analytics_events where created_at >= ${periodStart(days)}`)
  return {
    visitors: num(row.visitors),
    pageViews: num(row.page_views),
    activeStudents: num(row.active_students),
    watchedMinutes: Math.round(num(row.watched) / 60),
    enrollments: num(row.enrollments),
    completions: num(row.completions),
  }
}

async function daily(days: AnalyticsPeriod) {
  const rows = await rawRows(sql`
    with views as (
      select (created_at at time zone ${TIME_ZONE})::date as day, count(*) as page_views,
        count(distinct visitor_id) as visitors
      from analytics_events
      where type = 'page_view' and created_at >= ${periodStart(days)}
      group by 1
    )
    select to_char(d.day, 'YYYY-MM-DD') as day, coalesce(v.page_views, 0) as page_views,
      coalesce(v.visitors, 0) as visitors
    from generate_series((now() at time zone ${TIME_ZONE})::date - ${days - 1}::int,
      (now() at time zone ${TIME_ZONE})::date, interval '1 day') as d(day)
    left join views v on v.day = d.day::date
    order by d.day`)
  return rows.map((row) => ({ day: str(row.day), pageViews: num(row.page_views), visitors: num(row.visitors) }))
}

async function topPages(days: AnalyticsPeriod) {
  const rows = await rawRows(sql`
    select path, count(*) as views, count(distinct visitor_id) as visitors
    from analytics_events
    where type = 'page_view' and created_at >= ${periodStart(days)}
    group by path order by views desc limit 8`)
  return rows.map((row) => ({
    label: str(row.path),
    detail: `${num(row.visitors)} visitante${num(row.visitors) === 1 ? '' : 's'}`,
    value: num(row.views),
  }))
}

async function funnel(days: AnalyticsPeriod) {
  const [row = {}] = await rawRows(sql`
    select
      count(distinct visitor_id) filter (where type = 'page_view') as visited,
      count(distinct visitor_id) filter (where type = 'page_view' and path like '/cursos/%') as saw_course,
      count(distinct profile_id) filter (where type = 'enrollment') as enrolled,
      count(distinct profile_id) filter (where type = 'video_play') as played,
      count(distinct profile_id) filter (where type = 'lesson_complete') as completed
    from analytics_events where created_at >= ${periodStart(days)}`)
  return [
    { label: 'Visitaram o site', detail: 'Navegadores únicos', value: num(row.visited) },
    { label: 'Abriram a página de um curso', detail: 'Navegadores únicos', value: num(row.saw_course) },
    { label: 'Se matricularam', detail: 'Alunos', value: num(row.enrolled) },
    { label: 'Deram play numa aula', detail: 'Alunos', value: num(row.played) },
    { label: 'Concluíram uma aula', detail: 'Alunos', value: num(row.completed) },
  ]
}

async function lessons(days: AnalyticsPeriod) {
  const rows = await rawRows(sql`
    select l.id, l.title, c.title as course_title,
      count(distinct e.profile_id) filter (where e.type in ('video_play', 'video_watch')) as students,
      coalesce(sum(e.seconds) filter (where e.type = 'video_watch'), 0) as watched,
      count(*) filter (where e.type = 'lesson_complete') as completions
    from analytics_events e
    join lessons l on l.id = e.lesson_id
    join course_modules m on m.id = l.module_id
    join courses c on c.id = m.course_id
    where e.created_at >= ${periodStart(days)}
    group by l.id, l.title, c.title
    order by watched desc, students desc, completions desc
    limit 10`)
  return rows.map((row) => ({
    lessonId: num(row.id),
    title: str(row.title),
    courseTitle: str(row.course_title),
    students: num(row.students),
    watchedMinutes: Math.round(num(row.watched) / 60),
    completions: num(row.completions),
  }))
}

// Relatório da página de análise para os últimos `period` dias
export async function getAnalyticsReport(period: AnalyticsPeriod): Promise<AnalyticsReport> {
  const [totalsData, dailyData, pages, funnelData, lessonData] = await Promise.all([
    totals(period),
    daily(period),
    topPages(period),
    funnel(period),
    lessons(period),
  ])
  return { period, totals: totalsData, daily: dailyData, topPages: pages, funnel: funnelData, lessons: lessonData }
}
