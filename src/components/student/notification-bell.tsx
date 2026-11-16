'use client'

import { AwardIcon, BellIcon, CheckCheckIcon, GraduationCapIcon, MessageCircleReplyIcon } from 'lucide-react'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatRelative } from '@/lib/dates'
import { cn } from '@/lib/utils'
import type { Inbox, NotificationKind } from '@/types/notification'
import { useInbox } from './use-inbox'

const icons: Record<NotificationKind, typeof BellIcon> = {
  answer: MessageCircleReplyIcon,
  enrollment: GraduationCapIcon,
  certificate: AwardIcon,
}

type NotificationBellProps = { initial: Inbox; side?: 'right' | 'bottom' }

// Sino da área do aluno com o número de avisos não lidos
export function NotificationBell({ initial, side = 'right' }: NotificationBellProps) {
  const { inbox, markRead, refresh } = useInbox(initial)
  const label = inbox.unread ? `Notificações, ${inbox.unread} não lidas` : 'Notificações'

  return (
    <DropdownMenu onOpenChange={(open) => open && refresh()}>
      <DropdownMenuTrigger
        aria-label={label}
        className="relative flex size-9 cursor-pointer items-center justify-center rounded-xl text-ink/65 transition outline-none hover:bg-secondary hover:text-ink focus-visible:ring-4 focus-visible:ring-lime/30 data-[state=open]:bg-secondary"
      >
        <BellIcon className="size-5" />
        {inbox.unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 animate-in items-center justify-center rounded-full bg-lime px-1 text-2xs font-bold text-pine zoom-in-50">
            {inbox.unread > 9 ? '9+' : inbox.unread}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align="start" className="w-80 rounded-2xl p-0 sm:w-96">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-semibold">Notificações</p>
          {inbox.unread > 0 && (
            <button
              type="button"
              onClick={() => markRead()}
              className="flex items-center gap-1 text-xs font-semibold text-pine hover:underline dark:text-lime"
            >
              <CheckCheckIcon className="size-3.5" />
              Marcar todas como lidas
            </button>
          )}
        </div>
        {inbox.items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <BellIcon className="size-8 text-ink/25" />
            <p className="text-sm text-ink/65">Nada por aqui ainda. Respostas às suas dúvidas aparecem aqui.</p>
          </div>
        ) : (
          <ul className="max-h-96 overflow-y-auto p-1.5">
            {inbox.items.map((item) => {
              const Icon = icons[item.kind]
              return (
                <DropdownMenuItem key={item.id} asChild className="cursor-pointer items-start gap-3 rounded-xl p-3">
                  <Link href={item.href} onClick={() => !item.read && markRead(item.id)}>
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl',
                        item.read ? 'bg-secondary text-ink/65' : 'bg-lime text-pine',
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cn('block text-sm', item.read ? 'text-ink/70' : 'font-semibold text-ink')}>
                        {item.title}
                      </span>
                      {item.body && <span className="line-clamp-2 block text-xs text-ink/65">{item.body}</span>}
                      <span className="mt-1 block text-2xs text-ink/65">{formatRelative(item.createdAt)}</span>
                    </span>
                    {!item.read && (
                      <span aria-label="não lida" className="mt-1.5 size-2 shrink-0 rounded-full bg-sage" />
                    )}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
