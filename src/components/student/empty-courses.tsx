import { CompassIcon } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'

// Estado vazio de quem ainda não se matriculou em nenhum curso
export function EmptyCourses({ title = 'Seu primeiro curso está a um clique' }: { title?: string }) {
  return (
    <section className="flex flex-col items-center gap-4 rounded-3xl bg-card px-6 py-14 text-center ring-1 ring-ink/10">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-pine dark:text-lime">
        <CompassIcon className="size-7" />
      </span>
      <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      <p className="max-w-md text-ink/60">
        Os cursos são gratuitos. Matricule-se e a sua jornada aparece aqui, com progresso e certificado.
      </p>
      <ButtonLink href="/aluno/explorar" size="default">
        Explorar cursos
      </ButtonLink>
    </section>
  )
}
