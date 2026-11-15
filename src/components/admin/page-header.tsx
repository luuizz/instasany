import Link from 'next/link'
import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type Crumb = { href: string; label: string }

type PageHeaderProps = {
  title: string
  description?: React.ReactNode
  // Trilha até a página (a página atual entra sozinha, pelo título)
  breadcrumbs?: Crumb[]
  // Selo ao lado do título (status) e mídia à esquerda (capa)
  badge?: React.ReactNode
  media?: React.ReactNode
  actions?: React.ReactNode
}

export function PageHeader({ title, description, breadcrumbs, badge, media, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4">
      {breadcrumbs && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb) => (
              <Fragment key={crumb.href}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-64 truncate">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          {media}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
              {badge}
            </div>
            {description && <div className="mt-1.5 text-muted-foreground">{description}</div>}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
