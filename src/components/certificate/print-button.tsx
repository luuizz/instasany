'use client'

import { PrinterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintButton() {
  return (
    <Button type="button" onClick={() => window.print()} size="default">
      <PrinterIcon />
      Imprimir ou salvar em PDF
    </Button>
  )
}
