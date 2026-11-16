import { ImageResponse } from 'next/og'
import { site } from '@/config/site'
import { formatDuration } from '@/lib/duration'
import { getCertificate } from '@/server/services/certificates'

// Prévia do certificado quando o link é compartilhado (LinkedIn, WhatsApp...).
// O ImageResponse não lê o CSS do site, então as cores da marca vão escritas aqui.
const COLORS = { pine: '#1d3531', ink: '#0f1f1c', lime: '#ccec60', sage: '#5d8a83', paper: '#ffffff' }

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Certificado de conclusão da Instasany'

export default async function Image({ params }: { params: Promise<{ codigo: string }> }) {
  const certificate = await getCertificate((await params).codigo)
  const name = certificate?.studentName ?? site.name
  const course = certificate?.courseTitle ?? 'Certificado de conclusão'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        color: COLORS.paper,
        backgroundColor: COLORS.ink,
        backgroundImage: `radial-gradient(circle at 88% 8%, rgba(204,236,96,0.28), transparent 45%), linear-gradient(155deg, ${COLORS.pine}, ${COLORS.ink})`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: COLORS.lime,
              color: COLORS.pine,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 60 60">
              <path
                d="M30 0 C32 20 40 28 60 30 C40 32 32 40 30 60 C28 40 20 32 0 30 C20 28 28 20 30 0 Z"
                fill={COLORS.pine}
              />
            </svg>
          </div>
          {site.name}
        </div>
        {certificate && (
          <div style={{ display: 'flex', fontSize: 24, letterSpacing: 4, color: COLORS.lime }}>{certificate.code}</div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 6, color: COLORS.lime }}>
          CERTIFICADO DE CONCLUSÃO
        </div>
        <div
          style={{
            display: 'flex',
            alignSelf: 'flex-start',
            marginLeft: -72,
            padding: '14px 40px 14px 72px',
            borderRadius: '0 999px 999px 0',
            background: COLORS.lime,
            color: COLORS.pine,
            fontSize: 60,
            fontWeight: 700,
          }}
        >
          {name}
        </div>
        <div style={{ display: 'flex', fontSize: 52, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>{course}</div>
      </div>

      <div style={{ display: 'flex', gap: 48, fontSize: 26, color: 'rgba(255,255,255,0.7)' }}>
        {certificate && (
          <div style={{ display: 'flex' }}>Carga horária: {formatDuration(certificate.totalMinutes)}</div>
        )}
        <div style={{ display: 'flex' }}>{site.url.replace(/^https?:\/\//, '')}</div>
      </div>
    </div>,
    size,
  )
}
