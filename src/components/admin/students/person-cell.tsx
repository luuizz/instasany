import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initialsOf } from '@/lib/account'

// Avatar com as iniciais, nome e e-mail
export function PersonCell({ name, email }: { name: string; email: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Avatar aria-hidden className="size-10">
        <AvatarFallback className="bg-secondary text-sm font-bold text-pine">
          {initialsOf(name || email)}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0">
        <span className="block truncate font-semibold text-ink">{name || email.split('@')[0]}</span>
        <span className="block truncate text-sm text-muted-foreground">{email}</span>
      </span>
    </span>
  )
}
