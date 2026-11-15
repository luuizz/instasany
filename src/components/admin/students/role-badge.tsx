import { ShieldIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Role } from '@/types/students'

export const ROLE_LABELS: Record<Role, string> = { student: 'Aluno', admin: 'Admin' }

export function RoleBadge({ role }: { role: Role }) {
  return role === 'admin' ? (
    <Badge variant="live" className="gap-1">
      <ShieldIcon className="size-3" />
      {ROLE_LABELS.admin}
    </Badge>
  ) : (
    <Badge variant="muted">{ROLE_LABELS.student}</Badge>
  )
}
