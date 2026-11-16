'use client'

import { BookOpenCheckIcon, ListChecksIcon, AwardIcon } from 'lucide-react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { MockCertificate } from './mock-certificate'
import { MockDashboard } from './mock-dashboard'
import { MockQuiz } from './mock-quiz'
import { useProductAnimation } from './use-product-animation'

type TileProps = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  text: string
  className?: string
  dark?: boolean
  children: React.ReactNode
}

function Tile({ name, icon: Icon, title, text, className, dark, children }: TileProps) {
  return (
    <article
      data-tile={name}
      data-reveal-item
      className={cn(
        'relative isolate flex flex-col gap-5 overflow-hidden rounded-3xl p-5 sm:p-6',
        dark ? 'bg-pine text-paper' : 'bg-secondary text-ink',
        className,
      )}
    >
      {dark && <span aria-hidden className="absolute inset-0 -z-10 opacity-70 cover-art" />}
      <div aria-hidden className="flex-1">
        {children}
      </div>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-2xl',
            dark ? 'bg-lime text-pine' : 'bg-pine text-lime',
          )}
        >
          <Icon className="size-5" />
        </span>
        <span>
          <span className="block font-semibold">{title}</span>
          <span className={cn('block text-sm', dark ? 'text-paper/65' : 'text-ink/65')}>{text}</span>
        </span>
      </div>
    </article>
  )
}

// Bento do "Sobre nós": prévias animadas de como a plataforma funciona por dentro
export function ProductBento() {
  const scope = useRef<HTMLDivElement>(null)
  useProductAnimation(scope)

  return (
    <div ref={scope} className="grid gap-4 lg:grid-cols-12">
      <Tile
        name="dashboard"
        icon={BookOpenCheckIcon}
        title="Sua área do aluno"
        text="Continue de onde parou, acompanhe o progresso e veja sua semana de estudos."
        dark
        className="lg:col-span-7 lg:row-span-2"
      >
        <MockDashboard />
      </Tile>
      <Tile
        name="quiz"
        icon={ListChecksIcon}
        title="Quiz por módulo"
        text="Perguntas rápidas para fixar o conteúdo, corrigidas na hora."
        className="lg:col-span-5"
      >
        <MockQuiz />
      </Tile>
      <Tile
        name="certificate"
        icon={AwardIcon}
        title="Certificado no LinkedIn"
        text="Terminou o curso? O certificado sai na hora e vai para o seu perfil em um clique."
        dark
        className="lg:col-span-5"
      >
        <MockCertificate />
      </Tile>
    </div>
  )
}
