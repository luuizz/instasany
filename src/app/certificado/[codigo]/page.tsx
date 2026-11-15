import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CertificateCard } from '@/components/certificate/certificate-card'
import { PrintButton } from '@/components/certificate/print-button'
import { site } from '@/config/site'
import { qrCodeSvg } from '@/server/certificates/qr-code'
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
  const qrSvg = await qrCodeSvg(`${site.url}/certificado/${certificate.code}`)

  return (
    <div className="min-h-svh bg-muted px-4 py-10 print:min-h-0 print:bg-transparent print:p-0">
      <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/aluno" className="text-sm font-semibold text-pine hover:underline">
          ← Área do aluno
        </Link>
        <PrintButton />
      </div>

      <div className="mx-auto max-w-5xl print:max-w-none">
        <CertificateCard certificate={certificate} verifyUrl={verifyUrl} qrSvg={qrSvg} />
      </div>
      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-ink/50 print:hidden">
        {site.name} é um projeto fictício de estudo; este certificado não tem validade oficial.
      </p>
    </div>
  )
}
