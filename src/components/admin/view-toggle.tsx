'use client'

import { LayoutGridIcon, ListIcon } from 'lucide-react'
import { useOptimistic, useTransition } from 'react'
import { setAdminViewAction } from '@/app/(admin)/admin/actions'
import type { AdminView } from '@/lib/admin-view'
import { cn } from '@/lib/utils'

const options = [
  { value: 'grade', label: 'Grade', Icon: LayoutGridIcon },
  { value: 'lista', label: 'Lista', Icon: ListIcon },
] as const

// Alterna lista/grade com um indicador que desliza; a escolha fica num cookie e vale para todo o painel
export function ViewToggle({ view }: { view: AdminView }) {
  const [current, setCurrent] = useOptimistic(view)
  const [, startTransition] = useTransition()

  const choose = (value: AdminView) => {
    if (value === current) return
    startTransition(async () => {
      setCurrent(value)
      await setAdminViewAction(value)
    })
  }

  return (
    <div role="group" aria-label="Visualização" className="relative grid grid-cols-2 rounded-full bg-muted p-1">
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-card shadow-sm transition-transform duration-300 ease-out',
          current === 'lista' && 'translate-x-full',
        )}
      />
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={current === value}
          className={cn(
            'relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
            current === value ? 'text-pine' : 'text-muted-foreground hover:text-ink',
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
