import 'server-only'
import { cache } from 'react'
import { sql } from 'drizzle-orm'
import { buildAchievements, type Achievement } from '@/lib/achievements'
import { computeStreak, type StreakInfo } from '@/lib/streak'
import { num, rawRows, str } from '../db/raw'

const TIME_ZONE = 'America/Sao_Paulo'

// Dias com estudo (aula concluída, quiz, anotação ou vídeo assistido) no último ano, mais o "hoje" de São Paulo
async function activityDays(profileId: string) {
  const rows = await rawRows(sql`
    with activity as (
      select completed_at as at from lesson_progress where profile_id = ${profileId}
      union all select created_at from quiz_attempts where profile_id = ${profileId}
      union all select updated_at from lesson_notes where profile_id = ${profileId}
      union all select created_at from analytics_events
        where profile_id = ${profileId} and type in ('video_play', 'video_watch')
    )
    select distinct to_char((at at time zone ${TIME_ZONE})::date, 'YYYY-MM-DD') as day
    from activity where at >= now() - interval '400 days'`)
  const [today] = await rawRows(sql`select to_char((now() at time zone ${TIME_ZONE})::date, 'YYYY-MM-DD') as day`)
  return { days: rows.map((row) => str(row.day)), today: str(today?.day) }
}

async function counts(profileId: string) {
  const [row] = await rawRows(sql`
    select
      (select count(*) from lesson_progress where profile_id = ${profileId}) as lessons_done,
      (select count(*) from course_modules m
        where exists (select 1 from lessons l where l.module_id = m.id)
          and not exists (select 1 from lessons l where l.module_id = m.id
            and not exists (select 1 from lesson_progress lp where lp.lesson_id = l.id and lp.profile_id = ${profileId}))
      ) as modules_done,
      (select count(*) from quiz_attempts where profile_id = ${profileId} and total > 0 and score = total) as perfect_quizzes,
      (select count(*) from enrollments en
        where en.profile_id = ${profileId}
          and exists (select 1 from course_modules m join lessons l on l.module_id = m.id where m.course_id = en.course_id)
          and not exists (select 1 from course_modules m join lessons l on l.module_id = m.id
            where m.course_id = en.course_id
              and not exists (select 1 from lesson_progress lp where lp.lesson_id = l.id and lp.profile_id = ${profileId}))
      ) as courses_done,
      (select count(*) from certificates where profile_id = ${profileId}) as certificates,
      (select count(*) from lesson_notes where profile_id = ${profileId}) as notes`)
  return row
}

export type StudentProgress = { streak: StreakInfo; achievements: Achievement[] }

// Sequência de estudo e conquistas do aluno, calculadas na hora a partir do que ele já fez
export const getStudentProgress = cache(async (profileId: string): Promise<StudentProgress> => {
  const [{ days, today }, row] = await Promise.all([activityDays(profileId), counts(profileId)])
  const streak = computeStreak(days, today)
  const achievements = buildAchievements({
    lessonsDone: num(row?.lessons_done),
    modulesDone: num(row?.modules_done),
    perfectQuizzes: num(row?.perfect_quizzes),
    coursesDone: num(row?.courses_done),
    certificates: num(row?.certificates),
    notes: num(row?.notes),
    longestStreak: streak.longest,
  })
  return { streak, achievements }
})
