import Link from 'next/link'
import { cmsSections } from '@/config/cms'

export default function AdminHomePage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold text-ink">Conteúdo do site</h1>
      <p className="mt-2 text-ink/60">
        Escolha uma seção da home para editar. As mudanças aparecem no site assim que você salva.
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {cmsSections.map((section) => (
          <li key={section.key}>
            <Link
              href={`/admin/conteudo/${section.key}`}
              className="flex h-full flex-col gap-2 rounded-3xl border border-ink/10 p-6 transition hover:border-sage hover:shadow-lg"
            >
              <span className="text-lg font-semibold text-ink">{section.title}</span>
              <span className="text-sm text-ink/60">{section.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
