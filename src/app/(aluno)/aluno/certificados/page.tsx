import { AwardIcon, BadgeCheckIcon, ExternalLinkIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LinkedInIcon } from '@/components/certificate/linkedin-icon'
import { StudentPageHeader } from '@/components/student/student-page-header'
import { ButtonLink } from '@/components/ui/button'
import { site } from '@/config/site'
import { formatDate } from '@/lib/dates'
import { formatDuration } from '@/lib/duration'
import { linkedInAddToProfileUrl } from '@/lib/linkedin'
import { requireUser } from '@/server/auth/session'
import { listMyCertificates } from '@/server/services/certificates'

export const metadata: Metadata = { title: 'Certificados' }

export default async function MyCertificatesPage() {
  const profile = await requireUser('/aluno/certificados')
  const certificates = await listMyCertificates(profile.id)

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <StudentPageHeader
        eyebrow="Área do aluno"
        title="Certificados"
        description="Cada certificado tem um código que qualquer pessoa pode conferir, e vai para o LinkedIn em um clique."
      />
      {certificates.length === 0 ? (
        <section className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-14 text-center ring-1 ring-ink/10">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-pine dark:text-lime">
            <AwardIcon className="size-7" />
          </span>
          <h2 className="text-2xl font-semibold text-ink">Seu primeiro certificado vem aí</h2>
          <p className="max-w-md text-ink/65">
            Conclua todas as aulas e passe nos quizzes de um curso. O certificado sai na hora, pela lateral da aula.
          </p>
          <ButtonLink href="/aluno/cursos" size="default">
            Ver meus cursos
          </ButtonLink>
        </section>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => {
            const url = `${site.url}/certificado/${certificate.code}`
            return (
              <li
                key={certificate.code}
                className="flex flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-ink/10"
              >
                <Link href={`/certificado/${certificate.code}`} className="group relative block bg-pine p-6">
                  <span aria-hidden className="absolute inset-0 opacity-70 cover-art" />
                  <span className="light-surface relative block rounded-2xl bg-card p-5 shadow-xl shadow-ink/30 transition group-hover:-rotate-1">
                    <span className="block text-2xs font-semibold tracking-widest text-sage uppercase">
                      Certificado de conclusão
                    </span>
                    <span className="mt-2 block font-semibold text-balance text-ink">{certificate.courseTitle}</span>
                    <span className="mt-3 flex items-center justify-between text-xs text-ink/65">
                      {site.name}
                      <span className="flex items-center gap-1 text-sage">
                        <BadgeCheckIcon className="size-4" />
                        Verificado
                      </span>
                    </span>
                  </span>
                </Link>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-ink/65">Emitido em</dt>
                      <dd className="font-medium text-ink">{formatDate(certificate.issuedAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-ink/65">Carga horária</dt>
                      <dd className="font-medium text-ink">{formatDuration(certificate.totalMinutes)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-ink/65">Código</dt>
                      <dd className="font-mono font-medium tracking-wider text-ink">{certificate.code}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <ButtonLink href={`/certificado/${certificate.code}`} size="default" variant="outline">
                      <ExternalLinkIcon />
                      Abrir
                    </ButtonLink>
                    <ButtonLink
                      href={linkedInAddToProfileUrl({
                        courseTitle: certificate.courseTitle,
                        issuedAt: certificate.issuedAt,
                        code: certificate.code,
                        url,
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="default"
                    >
                      <LinkedInIcon className="size-4" />
                      Adicionar ao perfil
                    </ButtonLink>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
