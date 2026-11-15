'use client'

import { SendIcon } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'
import { FormMessage } from '@/components/ui/form-field'
import { SubmitButton } from '@/components/ui/submit-button'
import { Textarea } from '@/components/ui/textarea'
import { useFormAction } from '@/hooks/use-form-action'
import type { ActionResult } from '@/lib/result'

type MessageFormProps = {
  action: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>
  label: string
  placeholder: string
  submitLabel: string
  successMessage: string
  onDone?: () => void
}

// Caixa de mensagem das dúvidas; limpa depois de enviar
export function MessageForm({ action, label, placeholder, submitLabel, successMessage, onDone }: MessageFormProps) {
  const form = useRef<HTMLFormElement>(null)
  const { state, onSubmit, pending } = useFormAction<ActionResult | null>(async (previous, formData) => {
    const result = await action(previous, formData)
    // O aviso sai daqui porque a conversa pode sair da lista (e o formulário desmontar) ao ser respondida
    if (result.ok) {
      toast.success(successMessage)
      form.current?.reset()
      onDone?.()
    }
    return result
  }, null)

  return (
    <form ref={form} onSubmit={onSubmit} className="flex flex-col gap-3">
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <Textarea
        name="body"
        aria-label={label}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        required
        minLength={2}
      />
      <SubmitButton size="sm" pending={pending} pendingLabel="Enviando…" className="self-end">
        <SendIcon />
        {submitLabel}
      </SubmitButton>
    </form>
  )
}
