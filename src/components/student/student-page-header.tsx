type StudentPageHeaderProps = { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode }

// Topo das páginas da área do aluno, no mesmo ritmo do painel
export function StudentPageHeader({ eyebrow, title, description, actions }: StudentPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-sm font-medium text-sage">{eyebrow}</p>}
        <h1 className="mt-1 text-3xl font-semibold text-balance text-ink sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-ink/60">{description}</p>}
      </div>
      {actions}
    </header>
  )
}
