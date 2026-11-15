import { ExternalLinkIcon, EyeIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ActionsMenu } from '@/components/admin/actions-menu'
import { CourseForm } from '@/components/admin/course-form'
import { CourseModules } from '@/components/admin/course-modules'
import { PageHeader } from '@/components/admin/page-header'
import { StatusBadge } from '@/components/admin/status-badge'
import { CourseCover } from '@/components/courses/course-cover'
import { ButtonLink } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { countLabel, formatDuration } from '@/lib/duration'
import { isStorageConfigured } from '@/server/integrations/storage'
import { requireStaff } from '@/server/auth/session'
import { getCourseById } from '@/server/services/courses'
import { deleteCourseAction, saveCourseAction } from '../actions'

type PageProps = { params: Promise<{ id: string }> }

const loadCourse = async (params: PageProps['params']) => {
  const id = Number((await params).id)
  return Number.isInteger(id) ? getCourseById(id) : null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: (await loadCourse(params))?.title ?? 'Curso' }
}

export default async function EditCoursePage({ params }: PageProps) {
  const [course, profile] = await Promise.all([loadCourse(params), requireStaff()])
  if (!course) notFound()
  const firstLesson = course.modules.flatMap((module) => module.lessons)[0]

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { href: '/admin', label: 'Painel' },
          { href: '/admin/cursos', label: 'Cursos' },
        ]}
        title={course.title}
        badge={
          <StatusBadge tone={course.published ? 'live' : 'muted'}>
            {course.published ? 'Publicado' : 'Rascunho'}
          </StatusBadge>
        }
        media={
          <CourseCover
            title={course.title}
            coverUrl={course.coverUrl}
            compact
            className="hidden w-28 shrink-0 rounded-2xl sm:block"
          />
        }
        description={`${course.level} · ${countLabel(course.modules.length, 'módulo', 'módulos')} · ${countLabel(course.lessonCount, 'aula', 'aulas')} · ${formatDuration(course.totalMinutes)}`}
        actions={
          <>
            {firstLesson && (
              <ButtonLink
                href={`/aluno/cursos/${course.slug}/aulas/${firstLesson.id}`}
                variant="outline"
                size="default"
              >
                <EyeIcon />
                Ver como aluno
              </ButtonLink>
            )}
            {profile.role === 'admin' ? (
              <ActionsMenu
                links={
                  course.published
                    ? [
                        {
                          href: `/cursos/${course.slug}`,
                          label: 'Abrir página do curso',
                          icon: <ExternalLinkIcon />,
                          external: true,
                        },
                      ]
                    : []
                }
                danger={{
                  label: 'Excluir curso',
                  title: `Excluir o curso "${course.title}"?`,
                  description: 'Módulos, aulas, matrículas e progresso dos alunos também saem. Não dá para desfazer.',
                  run: deleteCourseAction.bind(null, course.id),
                }}
              />
            ) : (
              course.published && (
                <ButtonLink href={`/cursos/${course.slug}`} variant="ghost" size="default">
                  <ExternalLinkIcon />
                  Página do curso
                </ButtonLink>
              )
            )}
          </>
        }
      />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="rounded-3xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Informações</CardTitle>
            <CardDescription>Nome, endereço, textos do catálogo, capa e publicação.</CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm
              course={course}
              save={saveCourseAction.bind(null, course.id)}
              uploadsEnabled={isStorageConfigured()}
            />
          </CardContent>
        </Card>
        <Card className="rounded-3xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Conteúdo</CardTitle>
            <CardDescription>
              Módulos e aulas na ordem em que o aluno vê. Clique numa aula para editar o texto e o vídeo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CourseModules course={course} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
