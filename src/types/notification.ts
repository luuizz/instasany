export type NotificationKind = 'answer' | 'enrollment' | 'certificate'

export type InboxItem = {
  id: number
  kind: NotificationKind
  title: string
  body: string
  href: string
  read: boolean
  createdAt: Date
}

export type Inbox = { items: InboxItem[]; unread: number }
