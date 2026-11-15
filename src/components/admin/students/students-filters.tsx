import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { RoleFilter } from '@/types/students'

const roles: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'student', label: 'Alunos' },
  { value: 'admin', label: 'Admins' },
]

const hrefFor = (query: string, role: RoleFilter) => {
  const params = new URLSearchParams()
  if (query) params.set('busca', query)
  if (role !== 'all') params.set('papel', role)
  const search = params.toString()
  return search ? `/admin/alunos?${search}` : '/admin/alunos'
}

// Busca por nome ou e-mail e filtro por papel; tudo pela URL, funciona sem JavaScript
export function StudentsFilters({ query, role }: { query: string; role: RoleFilter }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form action="/admin/alunos" role="search" className="flex w-full max-w-md gap-2">
        {role !== 'all' && <input type="hidden" name="papel" value={role} />}
        <div className="relative flex-1">
          <SearchIcon aria-hidden className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            name="busca"
            defaultValue={query}
            placeholder="Buscar por nome ou e-mail"
            aria-label="Buscar alunos"
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>
      <nav aria-label="Filtrar por papel" className="flex gap-1 rounded-full bg-muted p-1">
        {roles.map((item) => (
          <Link
            key={item.value}
            href={hrefFor(query, item.value)}
            aria-current={item.value === role ? 'page' : undefined}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              item.value === role ? 'bg-card text-pine shadow-sm' : 'text-muted-foreground hover:text-ink',
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export { hrefFor as studentsHref }
