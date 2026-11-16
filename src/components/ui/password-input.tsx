'use client'

import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from './input'

// Campo de senha com botão para mostrar ou esconder o que foi digitado
export function PasswordInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-12', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Esconder a senha' : 'Mostrar a senha'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded-xl text-muted-foreground transition hover:text-foreground focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:outline-none"
      >
        {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
      </button>
    </div>
  )
}
