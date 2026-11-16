'use client'

import { useEffect, useState } from 'react'
import { getInboxAction, markInboxReadAction } from '@/app/(aluno)/aluno/notification-actions'
import type { Inbox } from '@/types/notification'

const REFRESH_MS = 60_000

// Estado do sino: começa com o que o layout trouxe e se atualiza a cada minuto com a aba visível
export function useInbox(initial: Inbox) {
  const [inbox, setInbox] = useState(initial)

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible')
        void getInboxAction()
          .then(setInbox)
          .catch(() => undefined)
    }
    const timer = setInterval(refresh, REFRESH_MS)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const markRead = (id?: number) => {
    // Atualiza na hora e confirma com o servidor
    setInbox((current) => ({
      unread: id
        ? Math.max(0, current.unread - (current.items.some((item) => item.id === id && !item.read) ? 1 : 0))
        : 0,
      items: current.items.map((item) => (id === undefined || item.id === id ? { ...item, read: true } : item)),
    }))
    void markInboxReadAction(id ? { id } : {})
      .then(setInbox)
      .catch(() => undefined)
  }

  return { inbox, markRead, refresh: () => void getInboxAction().then(setInbox) }
}
