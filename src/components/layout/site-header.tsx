import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/config/site'
import type { HeaderAccount } from '@/types/account'
import { HeaderAccountLinks } from './header-account'
import { HeaderAccountProvider } from './header-account-context'
import { HeaderShell } from './header-shell'
import { MobileMenu } from './mobile-menu'
import { SiteSearch } from './site-search'
import { SiteNav } from './site-nav'

// O site é estático: o cabeçalho descobre no navegador se há alguém logado.
// As áreas logadas já sabem quem é e passam em `account`.
export function SiteHeader({ account }: { account?: HeaderAccount }) {
  return (
    <HeaderAccountProvider known={account}>
      <HeaderShell>
        <Link href="/" aria-label={`${site.name}, página inicial`} className="shrink-0">
          <Image
            src="/brand/logo.svg"
            alt={site.name}
            width={186}
            height={49}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <div className="hidden lg:block">
          <SiteNav />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <SiteSearch />
          <HeaderAccountLinks />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <SiteSearch compact />
          <MobileMenu />
        </div>
      </HeaderShell>
    </HeaderAccountProvider>
  )
}
