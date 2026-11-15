import { deleteQuestionAction, replyQuestionAction } from '@/app/(aluno)/aluno/question-actions'
import type { QuestionThread as Thread } from '@/types/lms'
import { QuestionMessage } from './question-message'
import { ReplyToggle } from './reply-toggle'

type QuestionThreadProps = { thread: Thread; slug: string; lessonId: number; isStaff: boolean; replyOpen?: boolean }

// Pergunta, respostas e a caixa para responder
export function QuestionThread({ thread, slug, lessonId, isStaff, replyOpen }: QuestionThreadProps) {
  const remove = (id: number, mine: boolean) =>
    mine || isStaff ? deleteQuestionAction.bind(null, id, slug, lessonId) : undefined

  return (
    <div className="flex flex-col gap-4">
      <QuestionMessage message={thread} onDelete={remove(thread.id, thread.author.isMine)} />
      {thread.replies.length > 0 && (
        <div className="ml-5 flex flex-col gap-4 border-l-2 border-ink/10 pl-5">
          {thread.replies.map((reply) => (
            <QuestionMessage key={reply.id} message={reply} isReply onDelete={remove(reply.id, reply.author.isMine)} />
          ))}
        </div>
      )}
      <div className="ml-13 flex flex-col">
        <ReplyToggle action={replyQuestionAction.bind(null, thread.id, slug, lessonId)} startOpen={replyOpen} />
      </div>
    </div>
  )
}
