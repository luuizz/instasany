import { ArrowLeftIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { AuthShowcase } from '@/components/auth/auth-showcase'
import { site } from '@/config/site'

// Tela dividida: marca à esquerda no desktop, formulário centralizado à direita.
// No celular a marca vira uma faixa escura curta acima do formulário.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh bg-pine lg:grid-cols-2 lg:bg-paper">
      <AuthShowcase />

      <div className="flex flex-col">
        <div className="relative flex items-center justify-between overflow-hidden px-5 pt-6 pb-16 lg:hidden">
          <div aria-hidden className="absolute inset-0 opacity-70 cover-art" />
          <Link href="/" aria-label={`${site.name}, página inicial`} className="relative">
            <Image src="/brand/logo.svg" alt={site.name} width={186} height={49} priority className="h-9 w-auto" />
          </Link>
        </div>

        <div className="-mt-8 flex flex-1 flex-col rounded-t-4xl bg-paper px-5 pt-7 pb-10 sm:px-10 lg:mt-0 lg:rounded-none lg:px-12 lg:py-10">
          <Link
            href="/"
            className="flex items-center gap-2 self-start text-sm font-medium text-ink/65 transition hover:text-pine"
          >
            <ArrowLeftIcon className="size-4" />
            Voltar ao site
          </Link>
          <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">{children}</main>
        </div>
      </div>
    </div>
  )
}
