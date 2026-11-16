import { ImageResponse } from 'next/og'
import { countLabel, formatDuration } from '@/lib/duration'
import { OG_COLORS, OG_SIZE, OgBrand, OgChip, ogCanvas, siteHost } from '@/lib/seo/og'
import { getPublishedCourse } from '@/server/services/courses'
import { getReviewSummary } from '@/server/services/reviews'

// Prévia do curso quando o link é compartilhado
export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'Curso da Instasany'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const course = await getPublishedCourse((await params).slug)
  const reviews = course ? await getReviewSummary(course.id) : null

  return new ImageResponse(
    <div style={ogCanvas}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <OgBrand />
        <OgChip highlight>Grátis</OgChip>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', fontSize: 24, letterSpacing: 6, color: OG_COLORS.lime }}>
          {course ? `CURSO · ${course.level.toUpperCase()}` : 'CURSOS'}
        </div>
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, lineHeight: 1.05, maxWidth: 1000 }}>
          {course?.title ?? 'Cursos da Instasany'}
        </div>
        {course && (
          <div
            style={{ display: 'flex', fontSize: 28, lineHeight: 1.35, color: 'rgba(255,255,255,0.7)', maxWidth: 940 }}
          >
            {course.summary}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          {course && <OgChip>{countLabel(course.lessonCount, 'aula', 'aulas')}</OgChip>}
          {course && <OgChip>{formatDuration(course.totalMinutes)}</OgChip>}
          {reviews && reviews.count > 0 && (
            <OgChip>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
                <path
                  d="M12 2l3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.6 5.6 21.2l1.6-7.1L1.8 9.3 9 8.6z"
                  fill={OG_COLORS.lime}
                />
              </svg>
              {`${reviews.average.toFixed(1).replace('.', ',')} (${reviews.count})`}
            </OgChip>
          )}
          <OgChip>Certificado</OgChip>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.55)' }}>{siteHost}</div>
      </div>
    </div>,
    size,
  )
}
