import { CompassIcon } from 'lucide-react'
import { ErrorScreen } from '@/components/errors/error-screen'
import { ButtonLink } from '@/components/ui/button'

export default function StudentNotFound() {
  return (
    <ErrorScreen
      code="404"
      icon={CompassIcon}
      title="Não achamos essa tela"
      description="O curso pode ter saído do ar ou o link está antigo. Seus cursos e certificados continuam aqui."
    >
      <ButtonLink href="/aluno">Voltar para o início</ButtonLink>
      <ButtonLink href="/aluno/explorar" variant="outline">
        Explorar cursos
      </ButtonLink>
    </ErrorScreen>
  )
}
