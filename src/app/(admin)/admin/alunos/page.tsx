import { UsersIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { PageHeader } from '@/components/admin/page-header'
import { StudentsFilters, studentsHref } from '@/components/admin/students/students-filters'
import { StudentsTable } from '@/components/admin/students/students-table'
import { ButtonLink } from '@/components/ui/button'
import { countLabel } from '@/lib/duration'
import { ROLES } from '@/lib/roles'
import { requireAdmin } from '@/server/auth/session'
import { listStudents } from '@/server/services/students'
import type { RoleFilter } from '@/types/students'

export const metadata: Metadata = { title: 'Alunos' }

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? ''
const parseRole = (value: string): RoleFilter => ROLES.find((role) => role === value) ?? 'all'

export default async function StudentsPage({ searchParams }: PageProps) {
  await requireAdmin('/admin/alunos')
  const params = await searchParams
  const query = first(params.busca).slice(0, 80)
  const role = parseRole(first(params.papel))
  const page = Math.max(1, Math.floor(Number(first(params.pagina)) || 1))
  const list = await listStudents({ query, role, page })
  const pages = Math.max(1, Math.ceil(list.total / list.pageSize))
  const pageHref = (target: number) => {
    const base = studentsHref(query, role)
    return target === 1 ? base : `${base}${base.includes('?') ? '&' : '?'}pagina=${target}`
  }

  return (
    <>
      <PageHeader
        breadcrumbs={[{ href: '/admin', label: 'Painel' }]}
        title="Alunos"
        description={`${countLabel(list.total, 'pessoa encontrada', 'pessoas encontradas')}. Clique numa pessoa para ver cursos, progresso e atividade.`}
      />
      <StudentsFilters query={query} role={role} />
      {list.items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-12 text-center">
          <UsersIcon className="size-8 text-muted-foreground" />
          <p className="font-semibold">Ninguém encontrado</p>
          <p className="text-sm text-muted-foreground">
            {query ? 'Tente outro nome ou e-mail.' : 'As pessoas aparecem aqui depois do primeiro acesso.'}
          </p>
        </div>
      ) : (
        <StudentsTable students={list.items} />
      )}
      {pages > 1 && (
        <nav aria-label="Páginas" className="mt-6 flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">
            Página {page} de {pages}
          </span>
          <span className="flex gap-2">
            {page > 1 && (
              <ButtonLink href={pageHref(page - 1)} variant="outline" size="sm">
                Anterior
              </ButtonLink>
            )}
            {page < pages && (
              <ButtonLink href={pageHref(page + 1)} variant="outline" size="sm">
                Próxima
              </ButtonLink>
            )}
          </span>
        </nav>
      )}
    </>
  )
}
