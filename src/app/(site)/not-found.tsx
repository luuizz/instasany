import { CompassIcon } from 'lucide-react'
import { ErrorScreen } from '@/components/errors/error-screen'
import { ButtonLink } from '@/components/ui/button'

// Curso ou página do site que não existe (mantém o cabeçalho)
export default function SiteNotFound() {
  return (
    <ErrorScreen
      code="404"
      icon={CompassIcon}
      title="Não achamos essa página"
      description="Pode ser um curso que saiu do ar ou um link antigo. Os cursos disponíveis estão no catálogo."
    >
      <ButtonLink href="/cursos">Ver os cursos</ButtonLink>
      <ButtonLink href="/" variant="outline">
        Voltar para o início
      </ButtonLink>
    </ErrorScreen>
  )
}
