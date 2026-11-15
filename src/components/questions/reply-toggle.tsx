'use client'

import { ReplyIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { ActionResult } from '@/lib/result'
import { MessageForm } from './message-form'

type ReplyToggleProps = {
  action: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>
  startOpen?: boolean
}

// "Responder" abre a caixa de resposta embaixo da conversa
export function ReplyToggle({ action, startOpen = false }: ReplyToggleProps) {
  const [open, setOpen] = useState(startOpen)
  if (!open) {
    return (
      <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => setOpen(true)}>
        <ReplyIcon />
        Responder
      </Button>
    )
  }
  return (
    <MessageForm
      action={action}
      label="Sua resposta"
      placeholder="Escreva sua resposta"
      submitLabel="Responder"
      successMessage="Resposta enviada."
      onDone={() => setOpen(startOpen)}
    />
  )
}
