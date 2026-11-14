import type { Metadata } from 'next'
import { CourseCard } from '@/components/courses/course-card'
import { Container } from '@/components/ui/container'
import { listPublishedCourses } from '@/server/services/courses'

export const metadata: Metadata = {
  title: 'Cursos',
  description: 'Cursos online para criar, crescer e monetizar seu perfil no Instagram.',
}

export default async function CoursesPage() {
  const courses = await listPublishedCourses()

  return (
    <>
      <section className="border-t border-pine-line bg-pine bg-hero bg-top bg-no-repeat py-16 lg:py-24">
        <Container className="text-center">
          <p className="font-medium text-sage sm:text-lg">Cursos</p>
          <h1 className="mt-4 text-4xl/tight font-semibold text-balance text-paper sm:text-6xl/tight">
            Aprenda no seu ritmo, de casa
          </h1>
        </Container>
      </section>
      <Container className="py-16 lg:py-24">
        {courses.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <li key={course.id}>
                <CourseCard course={course} href={`/cursos/${course.slug}`} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-ink/60">Os cursos estão chegando. Volte em breve!</p>
        )}
      </Container>
    </>
  )
}
