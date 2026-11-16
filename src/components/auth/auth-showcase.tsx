import { AwardIcon, CheckIcon, PlayIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/config/site'

const perks = ['Aulas curtas, no seu ritmo', 'Quizzes e certificado para o LinkedIn', 'Grátis, sem cartão de crédito']

// Painel da marca ao lado do formulário (só no desktop)
export function AuthShowcase() {
  return (
    <aside className="relative hidden overflow-hidden bg-pine p-10 text-paper lg:flex lg:flex-col xl:p-14">
      <div aria-hidden className="absolute inset-0 cover-art" />
      <Link href="/" aria-label={`${site.name}, página inicial`} className="relative self-start">
        <Image src="/brand/logo.svg" alt={site.name} width={186} height={49} priority className="h-11 w-auto" />
      </Link>

      <div className="relative my-auto max-w-md py-12">
        <p className="text-sm font-medium text-lime">Área do aluno</p>
        <h2 className="mt-3 text-4xl leading-tight font-semibold text-balance xl:text-5xl">
          Do zero ao primeiro cliente no Instagram.
        </h2>
        <ul className="mt-8 flex flex-col gap-3">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-paper/80">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-lime text-pine">
                <CheckIcon className="size-3.5" strokeWidth={3} />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <div
          aria-hidden
          className="mt-12 flex max-w-sm -rotate-2 flex-col gap-3 rounded-3xl bg-paper p-5 text-ink shadow-2xl shadow-ink/40"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-lime text-pine">
              <PlayIcon className="ml-0.5 size-4 fill-pine" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-ink/50">Continue de onde parou</span>
              <span className="block truncate text-sm font-semibold">Bio que converte</span>
            </span>
          </div>
          <span className="h-2 overflow-hidden rounded-full bg-secondary">
            <span className="block h-full w-3/5 rounded-full bg-sage" />
          </span>
          <span className="flex items-center gap-2 text-xs text-ink/60">
            <AwardIcon className="size-3.5 text-sage" />
            Faltam 3 aulas para o certificado
          </span>
        </div>
      </div>

      <p className="relative text-sm text-paper/50">
        © {site.name} ·{' '}
        <Link href="/privacidade" className="underline-offset-4 hover:text-paper hover:underline">
          Privacidade
        </Link>
      </p>
    </aside>
  )
}
