import { AwardIcon } from 'lucide-react'
import { issueCertificateAction } from '@/app/(aluno)/aluno/course-actions'
import { ButtonLink } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button'
import type { CourseCompletion } from '@/types/lms'

type CourseFinishCardProps = { slug: string; completion: CourseCompletion; certificateCode: string | null }

const missing = ({ lessonsDone, lessonsTotal, quizzesPassed, quizzesTotal }: CourseCompletion) => {
  const lessons = lessonsTotal - lessonsDone
  const quizzes = quizzesTotal - quizzesPassed
  const parts = [
    lessons > 0 && `${lessons} ${lessons === 1 ? 'aula' : 'aulas'}`,
    quizzes > 0 && `${quizzes} ${quizzes === 1 ? 'quiz' : 'quizzes'}`,
  ].filter(Boolean)
  const verb = parts.length === 1 && lessons + quizzes === 1 ? 'Falta' : 'Faltam'
  return `${verb} ${parts.join(' e ')}`
}

// Certificado do curso: quanto falta, o botão de emitir ou o link para o já emitido
export function CourseFinishCard({ slug, completion, certificateCode }: CourseFinishCardProps) {
  const ready = completion.complete || certificateCode
  return (
    <section
      aria-labelledby="certificado"
      className={ready ? 'rounded-3xl bg-pine p-5 text-paper' : 'rounded-3xl border border-ink/10 p-5'}
    >
      <h2 id="certificado" className="flex items-center gap-2 font-semibold">
        <AwardIcon className={ready ? 'size-5 text-lime' : 'size-5 text-sage'} />
        Certificado
      </h2>
      {certificateCode ? (
        <>
          <p className="mt-2 text-sm text-paper/70">Curso concluído. Seu certificado já está pronto.</p>
          <ButtonLink href={`/certificado/${certificateCode}`} size="default" className="mt-4 w-full">
            Ver certificado
          </ButtonLink>
        </>
      ) : completion.complete ? (
        <>
          <p className="mt-2 text-sm text-paper/70">Você concluiu todas as aulas e quizzes. Parabéns!</p>
          <form action={issueCertificateAction.bind(null, slug)} className="mt-4">
            <SubmitButton size="default" pendingLabel="Emitindo…" className="w-full">
              Emitir certificado
            </SubmitButton>
          </form>
        </>
      ) : (
        <p className="mt-2 text-sm text-ink/60">{missing(completion)} para liberar o certificado.</p>
      )}
    </section>
  )
}
