import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { mainNav, site } from '@/config/site'
import type { FooterContent } from '@/types/home'

const heading = 'mb-4 text-sm font-semibold text-paper'
const link = 'text-paper/60 transition hover:text-lime'

export function SiteFooter({ content }: { content: FooterContent }) {
  return (
    <footer className="border-t border-pine-line bg-pine pt-16 pb-8 text-sm">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Image src="/brand/logo.svg" alt={site.name} width={186} height={49} className="h-10 w-auto self-start" />
            <p className="max-w-xs text-paper/60">{content.tagline}</p>
          </div>
          <nav aria-label="Rodapé">
            <p className={heading}>Navegação</p>
            <ul className="flex flex-col gap-2">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={link}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className={heading}>Plataforma</p>
            <ul className="flex flex-col gap-2">
              <li>
                <Link href="/cursos" className={link}>
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/entrar" className={link}>
                  Área do aluno
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className={link}>
                  Criar conta
                </Link>
              </li>
              <li>
                <a href={`mailto:${content.email}`} className={link}>
                  {content.email}
                </a>
              </li>
            </ul>
          </div>
          {content.socials.length > 0 && (
            <div>
              <p className={heading}>Redes</p>
              <ul className="flex flex-col gap-2">
                {content.socials.map((social) => (
                  <li key={social.href}>
                    <a href={social.href} target="_blank" rel="noreferrer" className={link}>
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-pine-line pt-8 text-paper/40 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Projeto fictício de estudo.
          </p>
          <Link href="/privacidade" className="hover:text-paper">
            Privacidade
          </Link>
        </div>
      </Container>
    </footer>
  )
}
