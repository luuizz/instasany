'use client'

import { MenuIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { Role } from '@/lib/roles'
import { AdminNav } from './admin-nav'

// No celular o menu do painel abre numa gaveta lateral
export function AdminMobileMenu({ role, footer }: { role: Role; footer: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-paper hover:bg-pine-line hover:text-paper"
          aria-label="Abrir menu"
        >
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-pine-line bg-pine p-6 text-paper [&>button]:text-paper">
        <SheetTitle className="text-paper">Menu do painel</SheetTitle>
        <AdminNav role={role} onNavigate={() => setOpen(false)} />
        <div className="mt-auto">{footer}</div>
      </SheetContent>
    </Sheet>
  )
}
