import 'server-only'
import { eq, sql } from 'drizzle-orm'
import { firstNameOf } from '@/lib/account'
import { db } from '../db/client'
import { num, rawRows, str } from '../db/raw'
import { emailLog, lessonQuestions, lessons, profiles } from '../db/schema'
import { answerEmail, enrollmentEmail, reminderEmail, welcomeEmail } from '../emails/messages'
import { sendEmail } from '../integrations/email'
import { pushNotification } from './inbox'

type Person = { id?: string; name: string; email: string }
type Kind = 'welcome' | 'enrollment' | 'answer' | 'reminder'

async function deliver(
  person: Person,
  kind: Kind,
  message: { subject: string; html: string; text: string },
  courseId?: number,
) {
  const sent = await sendEmail({ to: person.email, ...message })
  if (sent)
    await db()
      .insert(emailLog)
      .values({ profileId: person.id ?? null, kind, courseId: courseId ?? null })
  return sent
}

// Todas as funções abaixo rodam depois da resposta (after) e nunca lançam erro para quem chamou
const safely = async (label: string, task: () => Promise<unknown>) => {
  try {
    await task()
  } catch (error) {
    console.error(`[e-mail] ${label}:`, error)
  }
}

export const notifyWelcome = (person: Person) =>
  safely('boas-vindas', () => deliver(person, 'welcome', welcomeEmail(firstNameOf(person.name, person.email))))

export const notifyEnrollment = (person: Person, course: { id: number; title: string; slug: string }) =>
  safely('matrícula', async () => {
    if (person.id)
      await pushNotification(person.id, {
        kind: 'enrollment',
        title: 'Matrícula confirmada',
        body: `Você entrou no ${course.title}. Bons estudos!`,
        href: `/aluno/cursos/${course.slug}`,
      })
    await deliver(
      person,
      'enrollment',
      enrollmentEmail(firstNameOf(person.name, person.email), course.title, `/aluno/cursos/${course.slug}`),
      course.id,
    )
  })

// Avisa quem perguntou que alguém respondeu (não avisa quando a pessoa responde a si mesma)
export const notifyAnswer = (questionId: number, replier: Person & { id: string }, slug: string, excerpt: string) =>
  safely('resposta', async () => {
    const [row] = await db()
      .select({
        id: profiles.id,
        name: profiles.name,
        email: profiles.email,
        lessonId: lessons.id,
        lessonTitle: lessons.title,
      })
      .from(lessonQuestions)
      .innerJoin(profiles, eq(profiles.id, lessonQuestions.profileId))
      .innerJoin(lessons, eq(lessons.id, lessonQuestions.lessonId))
      .where(eq(lessonQuestions.id, questionId))
      .limit(1)
    if (!row || row.id === replier.id) return
    const short = excerpt.length > 280 ? `${excerpt.slice(0, 277)}...` : excerpt
    const path = `/aluno/cursos/${slug}/aulas/${row.lessonId}#duvidas`
    await pushNotification(row.id, {
      kind: 'answer',
      title: `${firstNameOf(replier.name, replier.email)} respondeu sua dúvida`,
      body: `Em "${row.lessonTitle}": ${short}`,
      href: path,
    })
    await deliver(
      row,
      'answer',
      answerEmail({
        firstName: firstNameOf(row.name, row.email),
        replierName: firstNameOf(replier.name, replier.email),
        lessonTitle: row.lessonTitle,
        excerpt: short,
        path,
      }),
    )
  })

export const INACTIVITY_DAYS = 7

// Alunos com curso em andamento parados há uma semana, que ainda não receberam lembrete
// desde a última atividade (um lembrete por pausa) e não desligaram os lembretes
export async function sendInactivityReminders() {
  const rows = await rawRows(sql`
    with progress as (
      select en.profile_id, c.id as course_id, c.title, c.slug,
        (select count(*) from lessons l join course_modules m on m.id = l.module_id where m.course_id = c.id) as total,
        (select count(*) from lesson_progress lp
          join lessons l on l.id = lp.lesson_id
          join course_modules m on m.id = l.module_id
          where m.course_id = c.id and lp.profile_id = en.profile_id) as done,
        greatest(en.created_at,
          (select max(a.created_at) from analytics_events a where a.profile_id = en.profile_id),
          (select max(lp.completed_at) from lesson_progress lp where lp.profile_id = en.profile_id)) as last_activity
      from enrollments en join courses c on c.id = en.course_id and c.published
    )
    select p.id, p.name, p.email, pr.course_id, pr.title, pr.slug, pr.total, pr.done
    from progress pr join profiles p on p.id = pr.profile_id
    where p.role = 'student' and p.email_reminders and pr.done < pr.total
      and pr.last_activity < now() - make_interval(days => ${INACTIVITY_DAYS})
      and not exists (select 1 from email_log e
        where e.profile_id = p.id and e.kind = 'reminder' and e.sent_at > pr.last_activity)
    order by pr.last_activity desc
    limit 200`)

  // Uma mensagem por pessoa, sobre o curso que ela mexeu por último
  const seen = new Set<string>()
  let sent = 0
  for (const row of rows) {
    const id = str(row.id)
    if (seen.has(id)) continue
    seen.add(id)
    const person = { id, name: str(row.name), email: str(row.email) }
    const message = reminderEmail({
      firstName: firstNameOf(person.name, person.email),
      courseTitle: str(row.title),
      done: num(row.done),
      total: num(row.total),
      path: `/aluno/cursos/${str(row.slug)}`,
    })
    if (await deliver(person, 'reminder', message, num(row.course_id))) sent += 1
  }
  return { candidates: seen.size, sent }
}
