import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/config/site'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center bg-pine bg-hero bg-top bg-no-repeat px-4 py-10">
      <Link href="/" aria-label={`${site.name}, página inicial`}>
        <Image src="/brand/logo.svg" alt={site.name} width={186} height={49} priority />
      </Link>
      <main className="mt-10 w-full max-w-md rounded-3xl bg-paper p-6 shadow-2xl shadow-ink/30 sm:p-10">
        {children}
      </main>
    </div>
  )
}
