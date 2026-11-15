import Link from 'next/link'

type PageHeaderProps = {
  title: string
  description?: string
  back?: { href: string; label: string }
  actions?: React.ReactNode
}

export function PageHeader({ title, description, back, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="mb-2 inline-block text-sm font-semibold text-sage hover:underline">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-3xl font-semibold text-ink">{title}</h1>
        {description && <p className="mt-2 text-ink/60">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  )
}
