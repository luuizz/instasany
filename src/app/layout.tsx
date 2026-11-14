import type { Metadata } from 'next'
import { Epilogue } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header/header'
import { createClient } from '@/prismicio'

const epilogue = Epilogue({ 
  subsets: ['latin'],
  weight: ['500', '600', '700']
})

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(): Promise<Metadata> {

  const client = createClient();

  const page = await client.getSingle("home");
 
  return {
    title: page.data.meta_title || "Instasany",
    description: page.data.meta_description || "Projeto de estudo dedicado ao Codeboost",
    openGraph: {
      images: [page.data.meta_image.url || ""],
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={epilogue.className}>
        <Header />
        {children}
        </body>
    </html>
  )
}
