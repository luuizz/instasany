'use client'

import { cn } from '@/lib/utils'

type ConfirmButtonProps = React.ComponentProps<'button'> & { message: string }

// Botão de envio que pede confirmação antes (usado em exclusões)
export function ConfirmButton({ message, className, onClick, ...props }: ConfirmButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault()
        onClick?.(event)
      }}
      className={cn('cursor-pointer', className)}
      {...props}
    />
  )
}
