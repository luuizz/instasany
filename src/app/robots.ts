import type { MetadataRoute } from 'next'
import { site } from '@/config/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/aluno', '/api', '/entrar', '/cadastro', '/esqueci-senha', '/redefinir-senha'],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
