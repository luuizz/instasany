import { MessageCircleQuestionIcon } from 'lucide-react'
import { askQuestionAction } from '@/app/(aluno)/aluno/question-actions'
import type { QuestionThread as Thread } from '@/types/lms'
import { MessageForm } from './message-form'
import { QuestionThread } from './question-thread'

type LessonQuestionsProps = { threads: Thread[]; slug: string; lessonId: number; isStaff: boolean }

// Dúvidas da aula: todos os alunos do curso veem e podem responder; a equipe aparece marcada
export function LessonQuestions({ threads, slug, lessonId, isStaff }: LessonQuestionsProps) {
  return (
    <section
      id="duvidas"
      aria-labelledby="duvidas-titulo"
      className="flex max-w-3xl scroll-mt-24 flex-col gap-6 border-t border-ink/10 pt-8"
    >
      <div>
        <h2 id="duvidas-titulo" className="flex items-center gap-2 text-xl font-semibold text-ink">
          <MessageCircleQuestionIcon className="size-5 text-sage" />
          Dúvidas da aula {threads.length > 0 && <span className="text-muted-foreground">({threads.length})</span>}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pergunte o que ficou confuso. A equipe responde por aqui, e os outros alunos do curso também podem ajudar.
        </p>
      </div>
      <MessageForm
        action={askQuestionAction.bind(null, lessonId, slug)}
        label="Sua dúvida"
        placeholder="Escreva sua dúvida sobre esta aula"
        submitLabel="Enviar dúvida"
        successMessage="Dúvida enviada."
      />
      {threads.length > 0 && (
        <ol className="flex flex-col gap-8">
          {threads.map((thread) => (
            <li key={thread.id}>
              <QuestionThread thread={thread} slug={slug} lessonId={lessonId} isStaff={isStaff} />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
