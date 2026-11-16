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
      title="Algo deu errado no painel"
      description="Nada foi perdido. Tente de novo; se o erro continuar, anote o código abaixo."
    >
      <ErrorActions error={error} reset={reset} home={{ href: '/admin', label: 'Voltar para a visão geral' }} />
    </ErrorScreen>
  )
}
