import '@fontsource-variable/jetbrains-mono'
import Image from 'next/image'
import { site } from '@/config/site'
import { formatDuration } from '@/lib/duration'
import { cn } from '@/lib/utils'
import type { Certificate } from '@/types/lms'
import styles from './certificate.module.css'
import { CertificateSeal } from './certificate-seal'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
})

type CertificateCardProps = { certificate: Certificate; verifyUrl: string; qrSvg: string }

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn(styles.metric, 'flex flex-col')}>
      <span className={styles.metricValue}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

// O certificado em si: escala junto com a largura (cqw), igual na tela e na impressão
export function CertificateCard({ certificate, verifyUrl, qrSvg }: CertificateCardProps) {
  return (
    <article className={cn(styles.sheet, 'rounded-3xl shadow-2xl shadow-ink/30 print:rounded-none print:shadow-none')}>
      <div aria-hidden className={styles.backdrop} />
      <div aria-hidden className={styles.grid} />
      <div aria-hidden className={styles.frame} />
      <div aria-hidden className={cn(styles.ruler, styles.rulerLeft)} />
      <div aria-hidden className={cn(styles.ruler, styles.rulerRight)} />

      <div className={styles.content}>
        <header className="flex items-start justify-between">
          <Image src="/brand/logo.svg" alt={site.name} width={186} height={49} className={styles.logo} />
          <div className="text-right">
            <p className={styles.label}>Código de verificação</p>
            <p className={styles.code}>{certificate.code}</p>
          </div>
        </header>

        <div className={cn('flex items-center justify-between', styles.gap2)}>
          <div className={cn('flex flex-col', styles.gap1)}>
            <p className={styles.eyebrow}>[ Certificado de conclusão ]</p>
            <p className={styles.lead}>Certificamos que</p>
            <h1 className={styles.band}>{certificate.studentName}</h1>
            <p className={styles.lead}>concluiu com êxito o curso</p>
            <p className={styles.course}>{certificate.courseTitle}</p>
            <p className={styles.note}>
              Assistiu a todas as aulas e foi aprovado nos quizzes de cada módulo da {site.name}.
            </p>
          </div>
          <CertificateSeal year={certificate.issuedAt.getFullYear()} className={styles.seal} />
        </div>

        <footer className={cn('flex items-end justify-between', styles.gap2)}>
          <div className={cn('flex', styles.gap1)}>
            <Metric label="Carga horária" value={formatDuration(certificate.totalMinutes)} />
            {certificate.startedAt && <Metric label="Início" value={day.format(certificate.startedAt)} />}
            <Metric label="Conclusão" value={day.format(certificate.issuedAt)} />
          </div>
          <div className={cn('flex items-end', styles.gap2)}>
            <span aria-hidden className={styles.divider} />
            <p className={styles.verify}>
              Para conferir a autenticidade, leia o QR code ou acesse
              <br />
              <strong>{verifyUrl}</strong>
            </p>
            {/* SVG gerado no servidor pelo pacote qrcode a partir do endereço do certificado */}
            <div className={styles.qr} dangerouslySetInnerHTML={{ __html: qrSvg }} />
          </div>
        </footer>
      </div>
    </article>
  )
}
