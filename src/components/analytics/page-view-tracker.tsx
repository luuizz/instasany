'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { isTrackedPath } from '@/lib/analytics'
import { track } from './track'

// Conta uma página vista a cada troca de rota (o painel fica de fora)
export function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname && isTrackedPath(pathname)) track({ type: 'page_view', path: pathname })
  }, [pathname])

  return null
}
