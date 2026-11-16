'use client'

import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react'
import { cloneElement, isValidElement, useId } from 'react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from './alert'
import { Field, FieldDescription, FieldLabel } from './field'

type LabeledFieldProps = {
  label: string
  hint?: string
  // Conteúdo ao lado do rótulo, como um link "Esqueci a senha"
  aside?: React.ReactNode
  className?: string
  children: React.ReactElement<{ id?: string; 'aria-describedby'?: string }>
}

// Field do shadcn com rótulo e dica já ligados ao controle (id gerado quando o controle não tem)
export function LabeledField({ label, hint, aside, className, children }: LabeledFieldProps) {
  const generated = useId()
  const id = (isValidElement(children) && children.props.id) || generated
  const hintId = hint ? `${id}-dica` : undefined
  const control = isValidElement(children) ? cloneElement(children, { id, 'aria-describedby': hintId }) : children

  return (
    <Field className={cn('gap-2', className)}>
      {aside ? (
        <div className="flex items-baseline justify-between gap-3">
          <FieldLabel htmlFor={id} className="font-semibold">
            {label}
          </FieldLabel>
          {aside}
        </div>
      ) : (
        <FieldLabel htmlFor={id} className="font-semibold">
          {label}
        </FieldLabel>
      )}
      {control}
      {hint && (
        <FieldDescription id={hintId} className="text-xs">
          {hint}
        </FieldDescription>
      )}
    </Field>
  )
}

// Aviso de formulário (erro devolvido pela action, ou confirmação) no estilo Alert do shadcn
export function FormMessage({ tone = 'error', children }: { tone?: 'error' | 'success'; children?: React.ReactNode }) {
  if (!children) return null
  const Icon = tone === 'error' ? CircleAlertIcon : CircleCheckIcon
  return (
    <Alert
      variant={tone === 'error' ? 'destructive' : 'default'}
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'animate-in rounded-2xl duration-200 fade-in slide-in-from-top-1',
        tone === 'error' ? 'border-destructive/30 bg-destructive/5' : 'border-lime bg-lime/20 text-pine',
      )}
    >
      <Icon />
      <AlertDescription className={tone === 'error' ? 'text-destructive' : 'text-pine'}>{children}</AlertDescription>
    </Alert>
  )
}
