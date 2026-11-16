import { ImageResponse } from 'next/og'
import { site } from '@/config/site'
import { formatDuration } from '@/lib/duration'
import { OG_COLORS as COLORS, OG_SIZE, OgBrand, ogCanvas, siteHost } from '@/lib/seo/og'
import { getCertificate } from '@/server/services/certificates'

// Prévia do certificado quando o link é compartilhado (LinkedIn, WhatsApp...)
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Certificado de conclusão da Instasany'

export default async function Image({ params }: { params: Promise<{ codigo: string }> }) {
  const certificate = await getCertificate((await params).codigo)
  const name = certificate?.studentName ?? site.name
  const course = certificate?.courseTitle ?? 'Certificado de conclusão'

  return new ImageResponse(
    <div style={ogCanvas}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <OgBrand />
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
        <div style={{ display: 'flex' }}>{siteHost}</div>
      </div>
    </div>,
    size,
  )
}
