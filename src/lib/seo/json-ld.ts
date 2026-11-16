import { site } from '@/config/site'
import type { CourseOutline, ReviewSummary } from '@/types/lms'

// Dados estruturados (schema.org) para o Google entender a marca e mostrar os cursos com nota e duração

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/logo.svg`,
    description: site.description,
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: 'pt-BR',
  }
}

// Duração em ISO 8601 (PT1H20M), como o schema.org pede
function isoDuration(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return `PT${hours ? `${hours}H` : ''}${rest || !hours ? `${rest}M` : ''}`
}

export function courseJsonLd(course: CourseOutline, reviews: ReviewSummary) {
  const url = `${site.url}/cursos/${course.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.summary,
    url,
    inLanguage: 'pt-BR',
    educationalLevel: course.level,
    ...(course.coverUrl ? { image: course.coverUrl } : {}),
    provider: { '@type': 'Organization', name: site.name, sameAs: site.url },
    offers: {
      '@type': 'Offer',
      category: 'Free',
      price: 0,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: isoDuration(course.totalMinutes),
    },
    syllabusSections: course.modules.map((module) => ({
      '@type': 'Syllabus',
      name: module.title,
      description: module.lessons.map((lesson) => lesson.title).join(', '),
    })),
    ...(reviews.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(reviews.average.toFixed(1)),
            ratingCount: reviews.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  }
}
