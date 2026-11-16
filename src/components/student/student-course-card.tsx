import { AwardIcon } from 'lucide-react'
import Link from 'next/link'
import { CourseCard } from '@/components/courses/course-card'
import { ProgressBar } from '@/components/courses/progress-bar'
import type { DashboardCourse } from '@/types/lms'

// Card de um curso do aluno: progresso, próxima aula e atalho para o certificado
export function StudentCourseCard({ course }: { course: DashboardCourse }) {
  const finished = course.completedCount >= course.lessonCount
  return (
    <CourseCard
      course={course}
      href={`/aluno/cursos/${course.slug}`}
      footer={
        <div className="flex flex-col gap-3">
          <ProgressBar done={course.completedCount} total={course.lessonCount} />
          {course.certificateCode ? (
            <Link
              href={`/certificado/${course.certificateCode}`}
              className="flex items-center gap-2 text-sm font-semibold text-pine hover:underline dark:text-lime"
            >
              <AwardIcon className="size-4 text-sage" />
              Ver certificado
            </Link>
          ) : (
            <p className="truncate text-sm text-ink/65">
              {finished
                ? 'Aulas concluídas: falta emitir o certificado na aula.'
                : course.nextLessonTitle
                  ? `Próxima: ${course.nextLessonTitle}`
                  : 'Comece pela primeira aula.'}
            </p>
          )}
        </div>
      }
    />
  )
}
