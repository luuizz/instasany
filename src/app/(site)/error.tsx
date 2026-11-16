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
      title="Algo deu errado por aqui"
      description="Não foi culpa sua. Tente de novo em instantes; se continuar, volte mais tarde."
    >
      <ErrorActions error={error} reset={reset} home={{ href: '/', label: 'Voltar para o início' }} />
    </ErrorScreen>
  )
}
