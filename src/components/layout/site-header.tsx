import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { mainNav, site } from '@/config/site'
import { MobileMenu } from './mobile-menu'

export function SiteHeader() {
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
          <nav aria-label="Principal" className="flex gap-2">
            {mainNav.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  index === 0
                    ? 'rounded-full bg-sage px-3 py-1 text-paper'
                    : 'px-3 py-1 text-paper/40 transition hover:text-paper'
                }
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-6">
            <button type="button" aria-label="Buscar" className="cursor-pointer">
              <Image src="/icons/search.svg" alt="" width={22} height={23} />
            </button>
            <Link href="/entrar" className="flex items-center gap-2 font-medium text-paper hover:text-lime">
              <Image src="/icons/user.svg" alt="" width={24} height={24} />
              Fazer login
            </Link>
          </div>
        </div>

        <MobileMenu />
      </Container>
    </header>
  )
}
