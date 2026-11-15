import { GraduationCapIcon, ShieldIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ROLE_LABELS, type Role } from '@/lib/roles'

export { ROLE_LABELS }

export function RoleBadge({ role }: { role: Role }) {
  if (role === 'student') return <Badge variant="muted">{ROLE_LABELS.student}</Badge>
  return (
    <Badge variant={role === 'admin' ? 'live' : 'outline'} className="gap-1">
      {role === 'admin' ? <ShieldIcon className="size-3" /> : <GraduationCapIcon className="size-3" />}
      {ROLE_LABELS[role]}
    </Badge>
  )
}
