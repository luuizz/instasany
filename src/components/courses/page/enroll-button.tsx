import { PlayIcon } from 'lucide-react'
import { enrollAction } from '@/app/(site)/cursos/actions'
import { ButtonLink } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import { cn } from '@/lib/utils'

type EnrollButtonProps = { slug: string; enrolled: boolean; fullWidth?: boolean }

// Ação principal da página do curso: matricular (form da Server Action) ou continuar estudando
export function EnrollButton({ slug, enrolled, fullWidth = false }: EnrollButtonProps) {
  const width = fullWidth && 'w-full'
  if (enrolled) {
    return (
      <ButtonLink href={`/aluno/cursos/${slug}`} className={cn(width)}>
        <PlayIcon className="fill-current" />
        Continuar curso
      </ButtonLink>
    )
  }
  return (
    <form action={enrollAction.bind(null, slug)} className={cn('flex', width)}>
      <SubmitButton className={cn(width)}>Matricular-se grátis</SubmitButton>
    </form>
  )
}
