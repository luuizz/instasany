'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PLAYER_SHORTCUTS } from './use-player-shortcuts'

type PlayerShortcutsDialogProps = { open: boolean; onOpenChange: (open: boolean) => void }

export function PlayerShortcutsDialog({ open, onOpenChange }: PlayerShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atalhos do player</DialogTitle>
          <DialogDescription>Valem em qualquer lugar da página da aula, menos enquanto você digita.</DialogDescription>
        </DialogHeader>
        <dl className="flex flex-col divide-y divide-border">
          {PLAYER_SHORTCUTS.map((shortcut) => (
            <div key={shortcut.label} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-sm text-ink/75">{shortcut.label}</dt>
              <dd className="flex shrink-0 gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="min-w-7 rounded-lg bg-secondary px-2 py-1 text-center font-mono text-xs font-semibold text-ink"
                  >
                    {key}
                  </kbd>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  )
}
