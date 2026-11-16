import 'server-only'
import { and, count, desc, eq, isNull } from 'drizzle-orm'
import type { Inbox, NotificationKind } from '@/types/notification'
import { db } from '../db/client'
import { notifications } from '../db/schema'

const LIMIT = 15

type NewItem = { kind: NotificationKind; title: string; body?: string; href: string }

// Aviso no sino da área do aluno; quem chama roda depois da resposta (after)
export async function pushNotification(profileId: string, item: NewItem) {
  try {
    await db()
      .insert(notifications)
      .values({ profileId, kind: item.kind, title: item.title, body: item.body ?? '', href: item.href })
  } catch (error) {
    console.error('[sino] não foi possível criar o aviso:', error)
  }
}

const KINDS: NotificationKind[] = ['answer', 'enrollment', 'certificate']
const asKind = (value: string): NotificationKind => KINDS.find((kind) => kind === value) ?? 'answer'

export async function getInbox(profileId: string): Promise<Inbox> {
  const [rows, [unread]] = await Promise.all([
    db()
      .select()
      .from(notifications)
      .where(eq(notifications.profileId, profileId))
      .orderBy(desc(notifications.createdAt))
      .limit(LIMIT),
    db()
      .select({ total: count() })
      .from(notifications)
      .where(and(eq(notifications.profileId, profileId), isNull(notifications.readAt))),
  ])
  return {
    unread: unread?.total ?? 0,
    items: rows.map((row) => ({
      id: row.id,
      kind: asKind(row.kind),
      title: row.title,
      body: row.body,
      href: row.href,
      read: row.readAt !== null,
      createdAt: row.createdAt,
    })),
  }
}

// Marca um aviso, ou todos quando id não vem, como lido
export async function markRead(profileId: string, id?: number) {
  const mine = eq(notifications.profileId, profileId)
  await db()
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(mine, isNull(notifications.readAt), id ? eq(notifications.id, id) : undefined))
}
