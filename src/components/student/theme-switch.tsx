'use client'

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { StudentTheme } from '@/lib/student-preferences'
import { cn } from '@/lib/utils'

export const themeOptions = [
  { id: 'light', label: 'Claro', icon: SunIcon },
  { id: 'dark', label: 'Escuro', icon: MoonIcon },
  { id: 'system', label: 'Automático', icon: MonitorIcon },
] as const

type ThemeSwitchProps = { theme: StudentTheme; onChange: (theme: StudentTheme) => void; compact?: boolean }

// Escolha do tema: três botões lado a lado, ou um só que alterna quando o menu está recolhido
export function ThemeSwitch({ theme, onChange, compact = false }: ThemeSwitchProps) {
  if (compact) {
    const index = themeOptions.findIndex((option) => option.id === theme)
    const current = themeOptions[index] ?? themeOptions[0]
    const next = themeOptions[(index + 1) % themeOptions.length] ?? themeOptions[0]
    const Icon = current.icon
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onChange(next.id)}
            aria-label={`Tema: ${current.label}. Trocar para ${next.label.toLowerCase()}`}
            className="mx-auto flex size-10 items-center justify-center rounded-2xl text-ink/60 transition hover:bg-secondary hover:text-ink"
          >
            <Icon className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Tema: {current.label}</TooltipContent>
      </Tooltip>
    )
  }
  return (
    <div role="radiogroup" aria-label="Tema" className="grid grid-cols-3 gap-1 rounded-2xl bg-secondary p-1">
      {themeOptions.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={theme === id}
          aria-label={label}
          title={label}
          onClick={() => onChange(id)}
          className={cn(
            'flex items-center justify-center rounded-xl py-2 transition',
            theme === id ? 'bg-card text-ink shadow-sm' : 'text-ink/55 hover:text-ink',
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  )
}
