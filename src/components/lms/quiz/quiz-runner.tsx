'use client'

import { RotateCcwIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { submitQuizAction } from '@/app/(aluno)/aluno/quiz-actions'
import { Button, ButtonLink } from '@/components/ui/button'
import { FormMessage } from '@/components/ui/form-field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SubmitButton } from '@/components/ui/submit-button'
import { cn } from '@/lib/utils'
import type { QuizResult, StudentQuiz } from '@/types/lms'
import { QuizReview } from './quiz-review'

type QuizRunnerProps = { quiz: StudentQuiz; next: { href: string; label: string } }

const letter = (index: number) => String.fromCharCode(65 + index)

// Responder o quiz, enviar e ver a correção; dá para refazer quantas vezes quiser
export function QuizRunner({ quiz, next }: QuizRunnerProps) {
  const [answers, setAnswers] = useState<number[]>(() => quiz.questions.map(() => -1))
  const [result, setResult] = useState<QuizResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const missing = answers.filter((answer) => answer < 0).length

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    startTransition(async () => {
      const response = await submitQuizAction({ quizId: quiz.id, answers })
      if (!response.ok) return setError(response.error)
      setError(null)
      setResult(response.data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <div
          role="status"
          className={cn(
            'flex animate-in flex-col gap-2 rounded-3xl p-6 fade-in slide-in-from-bottom-2',
            result.passed ? 'bg-pine text-paper' : 'border border-border bg-card',
          )}
        >
          <p className={cn('text-4xl font-semibold tabular-nums', result.passed ? 'text-lime' : 'text-ink')}>
            {result.score} de {result.total}
          </p>
          <p className="font-medium">
            {result.passed
              ? `Aprovado com ${result.percent}%. Módulo concluído!`
              : `${result.percent}% de acertos. Para passar, são ${result.passPercent}%.`}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {result.passed ? (
              <ButtonLink href={next.href} size="default">
                {next.label}
              </ButtonLink>
            ) : null}
            <Button
              type="button"
              variant={result.passed ? 'ghost' : 'default'}
              className={result.passed ? 'text-paper hover:bg-paper/10 hover:text-paper' : undefined}
              onClick={() => {
                setResult(null)
                setAnswers(quiz.questions.map(() => -1))
              }}
            >
              <RotateCcwIcon />
              Refazer
            </Button>
          </div>
        </div>
        <QuizReview review={result.review} />
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <FormMessage>{error}</FormMessage>
      {quiz.questions.map((question, index) => (
        <fieldset key={question.id} className="rounded-3xl border border-border bg-card p-5">
          <legend className="sr-only">Pergunta {index + 1}</legend>
          <p className="font-semibold text-ink">
            {index + 1}. {question.prompt}
          </p>
          <RadioGroup
            value={(answers.at(index) ?? -1) >= 0 ? String(answers.at(index)) : ''}
            onValueChange={(value) =>
              setAnswers((list) => list.map((answer, i) => (i === index ? Number(value) : answer)))
            }
            className="mt-4 gap-2"
            aria-label={`Pergunta ${index + 1}`}
          >
            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition hover:bg-muted has-data-[state=checked]:border-pine/30 has-data-[state=checked]:bg-lime/20"
              >
                <RadioGroupItem value={String(optionIndex)} />
                <span>
                  <span className="mr-1 font-medium text-muted-foreground">{letter(optionIndex)})</span> {option}
                </span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton pending={pending} pendingLabel="Corrigindo…" disabled={missing > 0 || pending}>
          Enviar respostas
        </SubmitButton>
        {missing > 0 && (
          <span className="text-sm text-muted-foreground">
            Falta{missing === 1 ? '' : 'm'} {missing} {missing === 1 ? 'pergunta' : 'perguntas'}
          </span>
        )}
      </div>
    </form>
  )
}
