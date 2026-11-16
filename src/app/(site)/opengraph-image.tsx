import { ImageResponse } from 'next/og'
import { site } from '@/config/site'
import { OG_COLORS, OG_SIZE, OgBrand, OgChip, ogCanvas, siteHost } from '@/lib/seo/og'

// Prévia padrão do site (home, catálogo e páginas sem prévia própria)
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = site.description

export default function Image() {
  return new ImageResponse(
    <div style={ogCanvas}>
      <OgBrand />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ display: 'flex', fontSize: 80, fontWeight: 700, lineHeight: 1.02, maxWidth: 980 }}>
          Do zero ao primeiro cliente no Instagram.
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: 'rgba(255,255,255,0.7)', maxWidth: 900 }}>
          {site.description}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <OgChip highlight>Grátis</OgChip>
          <OgChip>Aulas curtas</OgChip>
          <OgChip>Certificado no LinkedIn</OgChip>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: OG_COLORS.lime }}>{siteHost}</div>
      </div>
    </div>,
    size,
  )
}
