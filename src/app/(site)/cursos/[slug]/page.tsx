import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CourseCard } from '@/components/courses/course-card'
import { CourseReviews } from '@/components/courses/course-reviews'
import { CourseSyllabus } from '@/components/courses/course-syllabus'
import { CertificatePromo } from '@/components/courses/page/certificate-promo'
import { CourseCta } from '@/components/courses/page/course-cta'
import { CourseHero } from '@/components/courses/page/course-hero'
import { CourseHighlights } from '@/components/courses/page/course-highlights'
import { CourseIncludes } from '@/components/courses/page/course-includes'
import { EnrollCard } from '@/components/courses/page/enroll-card'
import { FaqSection } from '@/components/home/faq-section'
import { JsonLd } from '@/components/seo/json-ld'
import { Container } from '@/components/ui/container'
import { courseFaq } from '@/data/course-faq'
import { breadcrumbJsonLd, courseJsonLd } from '@/lib/seo/json-ld'
import { getCurrentProfile } from '@/server/auth/session'
import { getPublishedCourse, listCatalog } from '@/server/services/courses'
import { isEnrolled } from '@/server/services/learning'
import { getReviewSummary } from '@/server/services/reviews'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const course = await getPublishedCourse((await params).slug)
  if (!course) return {}
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/cursos/${course.slug}` },
    openGraph: { type: 'website', title: course.title, description: course.summary, url: `/cursos/${course.slug}` },
    twitter: { card: 'summary_large_image', title: course.title, description: course.summary },
  }
}

export default async function CoursePage({ params }: PageProps) {
  const course = await getPublishedCourse((await params).slug)
  if (!course) notFound()
  const profile = await getCurrentProfile().catch(() => null)
  const [enrolled, reviews, catalog] = await Promise.all([
    profile ? isEnrolled(profile.id, course.id) : false,
    getReviewSummary(course.id),
    listCatalog(),
  ])
  const paragraphs = course.description.split(/\n\s*\n/).filter(Boolean)
  const others = catalog.filter((item) => item.id !== course.id).slice(0, 3)

  return (
    <>
      <JsonLd
        data={[
          courseJsonLd(course, reviews),
          breadcrumbJsonLd([
            { name: 'Início', path: '/' },
            { name: 'Cursos', path: '/cursos' },
            { name: course.title, path: `/cursos/${course.slug}` },
          ]),
        ]}
      />
      <CourseHero course={course} reviews={reviews} enrolled={enrolled} />

      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 lg:py-24">
        <div className="flex min-w-0 flex-col gap-14">
          {paragraphs.length > 0 && (
            <section aria-labelledby="sobre-o-curso" className="flex flex-col gap-4">
              <h2 id="sobre-o-curso" className="text-2xl font-semibold text-ink">
                Sobre o curso
              </h2>
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg text-ink/70">
                  {paragraph}
                </p>
              ))}
            </section>
          )}
          <CourseHighlights modules={course.modules} />
          <section aria-labelledby="conteudo">
            <h2 id="conteudo" className="mb-6 text-2xl font-semibold text-ink">
              Conteúdo do curso
            </h2>
            <CourseSyllabus modules={course.modules} />
          </section>
          <CourseIncludes course={course} />
          <CertificatePromo courseTitle={course.title} />
          {reviews.count > 0 && <CourseReviews summary={reviews} />}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <EnrollCard course={course} enrolled={enrolled} />
          </div>
        </aside>
      </Container>

      <FaqSection content={courseFaq} />

      {others.length > 0 && (
        <Container className="py-16 lg:py-24">
          <h2 className="mb-8 text-2xl font-semibold text-ink sm:text-3xl">Outros cursos</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <li key={item.id}>
                <CourseCard course={item} href={`/cursos/${item.slug}`} />
              </li>
            ))}
          </ul>
        </Container>
      )}

      <CourseCta slug={course.slug} title={course.title} enrolled={enrolled} />
    </>
  )
}
