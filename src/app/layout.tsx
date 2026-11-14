import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/epilogue'
import { site } from '@/config/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Renda online com o Instagram`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, locale: site.locale, type: 'website' },
}

export const viewport: Viewport = { themeColor: '#1d3531' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
