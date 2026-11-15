import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PrintButton } from '@/components/certificate/print-button'
import { site } from '@/config/site'
import { formatDate } from '@/lib/dates'
import { formatDuration } from '@/lib/duration'
import { getCertificate } from '@/server/services/certificates'

type PageProps = { params: Promise<{ codigo: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const certificate = await getCertificate((await params).codigo)
  return {
    title: certificate ? `Certificado · ${certificate.courseTitle}` : 'Certificado',
    robots: { index: false },
  }
}

// Página pública do certificado: qualquer pessoa com o link confere a autenticidade pelo código
export default async function CertificatePage({ params }: PageProps) {
  const certificate = await getCertificate((await params).codigo)
  if (!certificate) notFound()
  const verifyUrl = `${site.url.replace(/^https?:\/\//, '')}/certificado/${certificate.code}`

  return (
    <div className="min-h-svh bg-paper px-4 py-10 print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/aluno" className="text-sm font-semibold text-pine hover:underline">
          ← Área do aluno
        </Link>
        <PrintButton />
      </div>

      <article className="mx-auto aspect-[1.414] w-full max-w-5xl rounded-3xl bg-pine p-3 shadow-2xl shadow-ink/20 print:max-w-none print:rounded-none print:shadow-none">
        <div className="flex size-full flex-col items-center justify-between rounded-2xl border-2 border-lime/40 px-6 py-8 text-center text-paper sm:px-16 sm:py-14">
          <Image src="/brand/logo.svg" alt={site.name} width={160} height={42} />
          <div className="flex flex-col items-center gap-3 sm:gap-5">
            <p className="text-xs font-semibold tracking-widest text-lime uppercase sm:text-sm">
              Certificado de conclusão
            </p>
            <p className="text-sm text-paper/70 sm:text-lg">Certificamos que</p>
            <h1 className="text-2xl font-semibold text-balance sm:text-5xl">{certificate.studentName}</h1>
            <p className="max-w-2xl text-sm text-balance text-paper/70 sm:text-lg">
              concluiu o curso <strong className="font-semibold text-paper">{certificate.courseTitle}</strong>, com
              carga de {formatDuration(certificate.totalMinutes)}, assistindo a todas as aulas e sendo aprovado nos
              quizzes.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-end justify-between gap-4 text-left text-xs text-paper/60 sm:text-sm">
            <p>
              Emitido em
              <br />
              <span className="font-semibold text-paper">{formatDate(certificate.issuedAt)}</span>
            </p>
            <p className="text-right">
              Código <span className="font-semibold tracking-wider text-lime">{certificate.code}</span>
              <br />
              Confira em {verifyUrl}
            </p>
          </div>
        </div>
      </article>
      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-ink/50 print:hidden">
        {site.name} é um projeto fictício de estudo; este certificado não tem validade oficial.
      </p>
    </div>
  )
}
