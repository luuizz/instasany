'use client'

import { LayoutGridIcon, ListIcon } from 'lucide-react'
import { useOptimistic, useTransition } from 'react'
import { setAdminViewAction } from '@/app/(admin)/admin/actions'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { parseAdminView, type AdminView } from '@/lib/admin-view'
import { cn } from '@/lib/utils'

// ToggleGroup do shadcn com um indicador que desliza; a escolha fica num cookie e vale para todo o painel
export function ViewToggle({ view }: { view: AdminView }) {
  const [current, setCurrent] = useOptimistic(view)
  const [, startTransition] = useTransition()

  const choose = (value: string) => {
    if (!value || value === current) return
    startTransition(async () => {
      setCurrent(parseAdminView(value))
      await setAdminViewAction(value)
    })
  }

  return (
    <ToggleGroup
      type="single"
      value={current}
      onValueChange={choose}
      aria-label="Visualização"
      className="relative grid grid-cols-2 rounded-full bg-muted p-1"
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-card shadow-sm transition-transform duration-300 ease-out',
          current === 'lista' && 'translate-x-full',
        )}
      />
      <ToggleGroupItem
        value="grade"
        className="relative z-10 h-9 cursor-pointer gap-2 rounded-full! px-4 font-semibold text-muted-foreground hover:bg-transparent hover:text-ink data-[state=on]:bg-transparent data-[state=on]:text-pine"
      >
        <LayoutGridIcon />
        Grade
      </ToggleGroupItem>
      <ToggleGroupItem
        value="lista"
        className="relative z-10 h-9 cursor-pointer gap-2 rounded-full! px-4 font-semibold text-muted-foreground hover:bg-transparent hover:text-ink data-[state=on]:bg-transparent data-[state=on]:text-pine"
      >
        <ListIcon />
        Lista
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
