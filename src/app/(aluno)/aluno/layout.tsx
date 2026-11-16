import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { StudentShell } from '@/components/student/student-shell'
import { isStaff } from '@/lib/roles'
import { MENU_COOKIE, parseMenu, parseTheme, THEME_COOKIE } from '@/lib/student-preferences'
import { requireUser } from '@/server/auth/session'
import { getStudentDashboard } from '@/server/services/student-dashboard'

export const metadata: Metadata = {
  title: { default: 'Área do aluno', template: '%s | Área do aluno' },
  robots: { index: false },
}

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireUser()
  const [{ current }, jar] = await Promise.all([getStudentDashboard(profile.id), cookies()])
  const done = current ? current.completedCount >= current.lessonCount : true
  return (
    <StudentShell
      name={profile.name || profile.email}
      email={profile.email}
      staff={isStaff(profile.role)}
      initialTheme={parseTheme(jar.get(THEME_COOKIE)?.value)}
      initialMenu={parseMenu(jar.get(MENU_COOKIE)?.value)}
      current={
        current && !done
          ? {
              title: current.title,
              nextLessonTitle: current.nextLessonTitle,
              percent: current.lessonCount ? Math.round((current.completedCount / current.lessonCount) * 100) : 0,
              href: current.nextLessonId
                ? `/aluno/cursos/${current.slug}/aulas/${current.nextLessonId}`
                : `/aluno/cursos/${current.slug}`,
            }
          : null
      }
    >
      {children}
    </StudentShell>
  )
}
