import { CompassIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ErrorScreen } from '@/components/errors/error-screen'
import { ButtonLink } from '@/components/ui/button'
import { site } from '@/config/site'

// Endereço que não existe em nenhuma parte do site
export default function NotFound() {
  return (
    <main>
      <Link href="/" aria-label={`${site.name}, página inicial`} className="fixed top-6 left-6 z-10">
        <Image src="/brand/logo.svg" alt={site.name} width={186} height={49} className="h-10 w-auto" />
      </Link>
      <ErrorScreen
        tone="dark"
        code="404"
        icon={CompassIcon}
        title="Essa página saiu do feed"
        description="O endereço pode ter mudado ou nunca ter existido. Que tal voltar para o início ou ver os cursos?"
      >
        <ButtonLink href="/">Voltar para o início</ButtonLink>
        <ButtonLink
          href="/cursos"
          variant="outline"
          className="border-paper/20 bg-transparent text-paper hover:bg-paper/10 hover:text-paper"
        >
          Ver os cursos
        </ButtonLink>
      </ErrorScreen>
    </main>
  )
}
