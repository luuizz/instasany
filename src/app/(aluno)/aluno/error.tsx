'use client'

import { TriangleAlertIcon } from 'lucide-react'
import { ErrorActions } from '@/components/errors/error-actions'
import { ErrorScreen } from '@/components/errors/error-screen'

type ErrorPageProps = { error: Error & { digest?: string }; reset: () => void }

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <ErrorScreen
      code="500"
      icon={TriangleAlertIcon}
      title="Não deu para carregar essa tela"
      description="Seu progresso está salvo. Tente de novo; se continuar, volte para o início da área do aluno."
    >
      <ErrorActions error={error} reset={reset} home={{ href: '/aluno', label: 'Voltar para o início' }} />
    </ErrorScreen>
  )
}
