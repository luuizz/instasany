import Image from 'next/image'
import Link from 'next/link'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { site } from '@/config/site'
import { AdminMobileMenu } from './admin-mobile-menu'
import { AdminNav } from './admin-nav'

type AdminShellProps = { userName: string; children: React.ReactNode }

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <Image src="/brand/logo.svg" alt={site.name} width={140} height={37} />
      <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold text-pine">Painel</span>
    </Link>
  )
}

function Account({ userName }: { userName: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-pine-line/60 p-3 text-sm">
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lime font-bold text-pine"
      >
        {userName.trim()[0]?.toUpperCase()}
      </span>
      <span className="min-w-0 flex-1 truncate text-paper/80">{userName}</span>
      <SignOutButton className="text-paper" />
    </div>
  )
}

// Moldura do painel: menu lateral fixo no desktop, barra com gaveta no celular; o conteúdo ocupa o resto da tela
export function AdminShell({ userName, children }: AdminShellProps) {
  return (
    <div className="min-h-svh bg-muted/40 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-8 bg-pine p-6 lg:sticky lg:top-0 lg:flex lg:h-svh">
        <Brand />
        <AdminNav />
        <div className="mt-auto">
          <Account userName={userName} />
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-pine px-4 py-3 lg:hidden">
        <Brand />
        <AdminMobileMenu footer={<Account userName={userName} />} />
      </header>
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10 lg:py-10 2xl:px-14">{children}</main>
    </div>
  )
}
