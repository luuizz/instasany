import { Trash2Icon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ConfirmButton } from '@/components/ui/confirm-dialog'
import { formatRelative } from '@/lib/dates'
import { cn } from '@/lib/utils'
import type { QuestionMessage as Message } from '@/types/lms'

type QuestionMessageProps = { message: Message; onDelete?: () => Promise<void>; isReply?: boolean }

export function QuestionMessage({ message, onDelete, isReply }: QuestionMessageProps) {
  const { author } = message
  return (
    <div className="flex gap-3">
      <Avatar aria-hidden className={isReply ? 'size-8' : 'size-10'}>
        <AvatarFallback
          className={cn(
            'font-bold',
            author.isStaff ? 'bg-pine text-lime' : 'bg-secondary text-pine dark:text-lime',
            isReply ? 'text-xs' : 'text-sm',
          )}
        >
          {author.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-ink">{author.isMine ? `${author.name} (você)` : author.name}</span>
          {author.isStaff && <Badge variant="live">Equipe</Badge>}
          <span className="text-muted-foreground">{formatRelative(message.createdAt)}</span>
          {onDelete && (
            <form action={onDelete} className="ml-auto">
              <ConfirmButton
                variant="ghost"
                size="icon-sm"
                aria-label="Apagar mensagem"
                title="Apagar esta mensagem?"
                description={isReply ? 'A resposta sai da conversa.' : 'A pergunta sai junto com todas as respostas.'}
                confirmLabel="Apagar"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2Icon />
              </ConfirmButton>
            </form>
          )}
        </div>
        <p className="mt-1 whitespace-pre-line text-ink/80">{message.body}</p>
      </div>
    </div>
  )
}
