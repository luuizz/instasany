'use client'

import { StarIcon } from 'lucide-react'
import { useState } from 'react'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { SubmitButton } from '@/components/ui/submit-button'
import { Textarea } from '@/components/ui/textarea'
import { useFormAction } from '@/hooks/use-form-action'
import type { ActionResult } from '@/lib/result'
import { cn } from '@/lib/utils'

type ReviewFormProps = {
  initial: { rating: number; comment: string } | null
  save: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>
}

const LABELS = ['Ruim', 'Fraco', 'Bom', 'Muito bom', 'Excelente'] as const

export function ReviewForm({ initial, save }: ReviewFormProps) {
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [hover, setHover] = useState(0)
  const { state, onSubmit, pending } = useFormAction<ActionResult | null>(save, null, 'Obrigado pela avaliação!')
  const shown = hover || rating

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Sua nota</legend>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {LABELS.map((label, index) => {
            const value = index + 1
            return (
              <label key={label} className="cursor-pointer" onMouseEnter={() => setHover(value)}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  onChange={() => setRating(value)}
                  className="peer sr-only"
                />
                <StarIcon
                  aria-hidden
                  className={cn(
                    'size-7 transition peer-focus-visible:rounded-sm peer-focus-visible:ring-4 peer-focus-visible:ring-ring/30',
                    value <= shown ? 'fill-lime text-pine' : 'fill-transparent text-ink/25',
                  )}
                />
                <span className="sr-only">
                  {value} {value === 1 ? 'estrela' : 'estrelas'}: {label}
                </span>
              </label>
            )
          })}
          {shown > 0 && <span className="ml-2 text-sm text-muted-foreground">{LABELS.at(shown - 1)}</span>}
        </div>
      </fieldset>
      <LabeledField label="Comentário" hint="Opcional. Aparece na página do curso com o seu primeiro nome.">
        <Textarea name="comment" defaultValue={initial?.comment ?? ''} rows={3} maxLength={600} />
      </LabeledField>
      <SubmitButton
        size="default"
        pending={pending}
        pendingLabel="Salvando…"
        disabled={!rating || pending}
        className="self-start"
      >
        {initial ? 'Atualizar avaliação' : 'Enviar avaliação'}
      </SubmitButton>
    </form>
  )
}
