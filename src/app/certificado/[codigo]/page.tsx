import { ArrowLeftIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CertificateCard } from '@/components/certificate/certificate-card'
import { CertificateActions } from '@/components/certificate/certificate-actions'
import { site } from '@/config/site'
import { getCurrentProfile } from '@/server/auth/session'
import { qrCodeSvg } from '@/server/certificates/qr-code'
import { getCertificate } from '@/server/services/certificates'

type PageProps = { params: Promise<{ codigo: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const certificate = await getCertificate((await params).codigo)
  if (!certificate) return { title: 'Certificado', robots: { index: false } }
  const title = `${certificate.studentName} concluiu ${certificate.courseTitle}`
  const description = `Certificado de conclusão da ${site.name}, código ${certificate.code}.`
  // A imagem de prévia vem de opengraph-image.tsx, ao lado desta página
  return {
    title: `Certificado · ${certificate.courseTitle}`,
    description,
    robots: { index: false },
    openGraph: { title, description, type: 'article', url: `${site.url}/certificado/${certificate.code}` },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// Página pública do certificado: qualquer pessoa com o link confere a autenticidade pelo código
export default async function CertificatePage({ params }: PageProps) {
  const certificate = await getCertificate((await params).codigo)
  if (!certificate) notFound()
  const verifyUrl = `${site.url.replace(/^https?:\/\//, '')}/certificado/${certificate.code}`
  const url = `${site.url}/certificado/${certificate.code}`
  const [qrSvg, viewer] = await Promise.all([qrCodeSvg(url), getCurrentProfile()])
  const isOwner = viewer?.id === certificate.profileId

  return (
    <div className="min-h-svh bg-muted px-4 py-10 print:min-h-0 print:bg-transparent print:p-0">
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3 print:hidden">
        {isOwner ? (
          <Link href="/aluno" className="flex items-center gap-2 text-sm font-semibold text-pine hover:underline">
            <ArrowLeftIcon className="size-4" />
            Área do aluno
          </Link>
        ) : (
          <Link href="/cursos" className="text-sm font-semibold text-pine hover:underline">
            Conhecer os cursos da {site.name}
          </Link>
        )}
        <CertificateActions certificate={certificate} url={url} isOwner={isOwner} />
      </div>

      <div className="mx-auto max-w-5xl print:max-w-none">
        <CertificateCard certificate={certificate} verifyUrl={verifyUrl} qrSvg={qrSvg} />
      </div>
      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-ink/65 print:hidden">
        {site.name} é um projeto fictício de estudo; este certificado não tem validade oficial.
      </p>
    </div>
  )
}
