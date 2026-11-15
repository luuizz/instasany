import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { site } from '@/config/site'
import type { HeaderAccount } from '@/types/account'
import { HeaderAccountLinks } from './header-account'
import { HeaderAccountProvider } from './header-account-context'
import { MobileMenu } from './mobile-menu'
import { SiteNav } from './site-nav'

// O site é estático: o cabeçalho descobre no navegador se há alguém logado.
// As áreas logadas já sabem quem é e passam em `account`.
export function SiteHeader({ account }: { account?: HeaderAccount }) {
  return (
    <HeaderAccountProvider known={account}>
      <header className="relative z-30 flex h-header items-center bg-pine">
        <Container className="flex items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name}, página inicial`} className="shrink-0">
            <Image
              src="/brand/logo.svg"
              alt={site.name}
              width={186}
              height={49}
              priority
              className="h-10 w-auto sm:h-12"
            />
          </Link>

          <div className="hidden items-center gap-4 text-sm lg:flex xl:gap-10 xl:text-base">
            <SiteNav />
            <div className="flex items-center gap-4 xl:gap-6">
              <Link href="/cursos" aria-label="Ver os cursos">
                <Image src="/icons/search.svg" alt="" width={22} height={23} />
              </Link>
              <HeaderAccountLinks />
            </div>
          </div>

          <MobileMenu />
        </Container>
      </header>
    </HeaderAccountProvider>
  )
}
