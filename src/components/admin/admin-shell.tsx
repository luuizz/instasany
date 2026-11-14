import Image from 'next/image'
import Link from 'next/link'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { site } from '@/config/site'

type AdminShellProps = { userName: string; nav: { href: string; label: string }[]; children: React.ReactNode }

export function AdminShell({ userName, nav, children }: AdminShellProps) {
  return (
    <div className="min-h-svh bg-paper lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="flex flex-col gap-8 bg-pine p-6 text-paper lg:sticky lg:top-0 lg:h-svh">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/brand/logo.svg" alt={site.name} width={140} height={37} />
          <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold text-pine">Painel</span>
        </Link>
        <nav aria-label="Painel" className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-2xl px-4 py-2 text-paper/70 hover:bg-pine-line hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between gap-4 text-sm text-paper/70">
          <span className="truncate">{userName}</span>
          <SignOutButton className="text-paper" />
        </div>
      </aside>
      <main className="p-6 sm:p-10">{children}</main>
    </div>
  )
}
