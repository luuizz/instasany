import { CheckIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QuizResult } from '@/types/lms'

const letter = (index: number) => String.fromCharCode(65 + index)

// Correção depois do envio: a escolha da pessoa, a certa e a explicação
export function QuizReview({ review }: { review: QuizResult['review'] }) {
  return (
    <ol className="flex flex-col gap-4">
      {review.map((item, index) => {
        const right = item.chosen === item.correct
        return (
          <li key={index} className="rounded-3xl border border-border bg-card p-5">
            <p className="flex items-start gap-3 font-semibold text-ink">
              <span
                className={cn(
                  'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
                  right ? 'bg-sage text-paper' : 'bg-destructive/15 text-destructive',
                )}
              >
                {right ? <CheckIcon className="size-4" /> : <XIcon className="size-4" />}
                <span className="sr-only">{right ? 'Acertou' : 'Errou'}</span>
              </span>
              {index + 1}. {item.prompt}
            </p>
            <ul className="mt-3 flex flex-col gap-1.5 pl-9 text-sm">
              {item.options.map((option, optionIndex) => (
                <li
                  key={optionIndex}
                  className={cn(
                    'rounded-xl px-3 py-2',
                    optionIndex === item.correct && 'bg-lime/30 font-medium text-pine',
                    optionIndex === item.chosen && !right && 'bg-destructive/10 text-destructive line-through',
                  )}
                >
                  {letter(optionIndex)}) {option}
                  {optionIndex === item.correct && <span className="ml-2 text-xs">(certa)</span>}
                  {optionIndex === item.chosen && <span className="ml-2 text-xs">(sua resposta)</span>}
                </li>
              ))}
            </ul>
            {item.explanation && <p className="mt-3 pl-9 text-sm text-muted-foreground">{item.explanation}</p>}
          </li>
        )
      })}
    </ol>
  )
}
