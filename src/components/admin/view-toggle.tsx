'use client'

import { useTransition } from 'react'
import { GridIcon, ListIcon } from '@/components/ui/icons'
import { setAdminViewAction } from '@/app/(admin)/admin/actions'
import type { AdminView } from '@/lib/admin-view'
import { cn } from '@/lib/utils'

const options = [
  { value: 'grade', label: 'Grade', Icon: GridIcon },
  { value: 'lista', label: 'Lista', Icon: ListIcon },
] as const

// Alterna lista/grade; a escolha fica num cookie e vale para todas as listas do painel
export function ViewToggle({ view }: { view: AdminView }) {
  const [pending, startTransition] = useTransition()

  const choose = (value: AdminView) => {
    if (value === view) return
    startTransition(() => setAdminViewAction(value))
  }

  return (
    <div
      role="group"
      aria-label="Visualização"
      className={cn('inline-flex rounded-full bg-ink/5 p-1', pending && 'opacity-60')}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={view === value}
          className={cn(
            'flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition',
            view === value ? 'bg-paper text-pine shadow-sm' : 'text-ink/50 hover:text-ink',
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  )
}
