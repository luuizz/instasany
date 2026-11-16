import { site } from '@/config/site'

// Peças comuns das imagens de prévia (Open Graph). O ImageResponse não lê o CSS do site,
// então as cores da marca vão escritas aqui.
export const OG_COLORS = { pine: '#1d3531', ink: '#0f1f1c', lime: '#ccec60', sage: '#5d8a83', paper: '#ffffff' }
export const OG_SIZE = { width: 1200, height: 630 }

export const ogCanvas = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '64px 72px',
  color: OG_COLORS.paper,
  backgroundColor: OG_COLORS.ink,
  backgroundImage: `radial-gradient(circle at 88% 8%, rgba(204,236,96,0.28), transparent 45%), linear-gradient(155deg, ${OG_COLORS.pine}, ${OG_COLORS.ink})`,
} as const

export function OgBrand() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          background: OG_COLORS.lime,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 60 60">
          <path
            d="M30 0 C32 20 40 28 60 30 C40 32 32 40 30 60 C28 40 20 32 0 30 C20 28 28 20 30 0 Z"
            fill={OG_COLORS.pine}
          />
        </svg>
      </div>
      {site.name}
    </div>
  )
}

export function OgChip({ children, highlight = false }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 22px',
        borderRadius: 999,
        fontSize: 26,
        fontWeight: highlight ? 700 : 500,
        background: highlight ? OG_COLORS.lime : 'rgba(255,255,255,0.1)',
        color: highlight ? OG_COLORS.pine : 'rgba(255,255,255,0.85)',
      }}
    >
      {children}
    </div>
  )
}

export const siteHost = site.url.replace(/^https?:\/\//, '')
