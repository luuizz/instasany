'use client'

import { TriangleAlertIcon } from 'lucide-react'
import { ErrorScreen } from '@/components/errors/error-screen'
import { Button } from '@/components/ui/button'
import './globals.css'

type GlobalErrorProps = { error: Error & { digest?: string }; reset: () => void }

// Erro no próprio layout raiz: substitui a página inteira, por isso traz <html> e o CSS
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="pt-BR">
      <body>
        <ErrorScreen
          tone="dark"
          code="500"
          icon={TriangleAlertIcon}
          title="O site tropeçou"
          description="Tente carregar de novo. Se continuar, volte em alguns minutos."
        >
          <Button onClick={reset}>Tentar de novo</Button>
          {error.digest && <p className="w-full text-xs text-paper/40">Código do erro: {error.digest}</p>}
        </ErrorScreen>
      </body>
    </html>
  )
}
