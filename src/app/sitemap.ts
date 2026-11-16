import type { MetadataRoute } from 'next'
import { site } from '@/config/site'
import { listCatalog } from '@/server/services/courses'

// Páginas públicas para o Google; a área do aluno, o painel e o login ficam de fora
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await listCatalog()
  return [
    { url: site.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/cursos`, changeFrequency: 'weekly', priority: 0.9 },
    ...courses.map((course) => ({
      url: `${site.url}/cursos/${course.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    { url: `${site.url}/privacidade`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
