'use client'

import { RotateCcwIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Button, ButtonLink } from '@/components/ui/button'

type ErrorActionsProps = {
  error: Error & { digest?: string }
  reset: () => void
  home: { href: string; label: string }
}

// Ações das telas de erro: tentar de novo, voltar e o código para mandar ao suporte
export function ErrorActions({ error, reset, home }: ErrorActionsProps) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <>
      <Button onClick={reset}>
        <RotateCcwIcon />
        Tentar de novo
      </Button>
      <ButtonLink href={home.href} variant="outline">
        {home.label}
      </ButtonLink>
      {error.digest && <p className="w-full text-xs text-ink/65">Código do erro: {error.digest}</p>}
    </>
  )
}
