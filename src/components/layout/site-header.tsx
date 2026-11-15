import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { site } from '@/config/site'
import { MobileMenu } from './mobile-menu'
import { SiteNav } from './site-nav'

export type HeaderAccount = { label: string; href: string }

const signedOut: HeaderAccount = { label: 'Fazer login', href: '/entrar' }

// O site público é estático e mostra "Fazer login" (quem já entrou é levado direto à área do aluno);
// as áreas logadas passam o nome da pessoa
export function SiteHeader({ account = signedOut }: { account?: HeaderAccount }) {
  return (
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

        <div className="hidden items-center gap-4 text-sm lg:flex xl:gap-20 xl:text-base">
          <SiteNav />
          <div className="flex items-center gap-6">
            <Link href="/cursos" aria-label="Ver os cursos">
              <Image src="/icons/search.svg" alt="" width={22} height={23} />
            </Link>
            <Link href={account.href} className="flex items-center gap-2 font-medium text-paper hover:text-lime">
              <Image src="/icons/user.svg" alt="" width={24} height={24} />
              {account.label}
            </Link>
          </div>
        </div>

        <MobileMenu account={account} />
      </Container>
    </header>
  )
}
