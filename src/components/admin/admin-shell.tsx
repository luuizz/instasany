import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/config/site'
import type { Role } from '@/lib/roles'
import { AccountMenu } from './account-menu'
import { AdminMobileMenu } from './admin-mobile-menu'
import { AdminNav } from './admin-nav'

type AdminShellProps = { userName: string; email: string; role: Role; children: React.ReactNode }

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3">
      <Image src="/brand/logo.svg" alt={site.name} width={140} height={37} />
      <span className="rounded-full bg-lime px-2 py-0.5 text-xs font-bold text-pine">Painel</span>
    </Link>
  )
}

// Moldura do painel: menu lateral fixo no desktop, barra com gaveta no celular; o conteúdo ocupa o resto da tela
export function AdminShell({ userName, email, role, children }: AdminShellProps) {
  return (
    <div className="min-h-svh bg-muted/40 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden flex-col gap-8 bg-pine p-6 lg:sticky lg:top-0 lg:flex lg:h-svh">
        <Brand />
        <AdminNav role={role} />
        <div className="mt-auto">
          <AccountMenu userName={userName} email={email} role={role} />
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-pine px-4 py-3 lg:hidden">
        <Brand />
        <AdminMobileMenu role={role} footer={<AccountMenu userName={userName} email={email} role={role} />} />
      </header>
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10 lg:py-10 2xl:px-14">{children}</main>
    </div>
  )
}
