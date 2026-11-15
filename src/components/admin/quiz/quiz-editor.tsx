'use client'

import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormMessage, LabeledField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import type { ActionResult } from '@/lib/result'
import { QUIZ_LIMITS } from '@/lib/validation/lms'
import type { QuizDraft, QuizQuestionInput } from '@/types/lms'
import { QuizQuestionCard } from './quiz-question-card'

type QuizEditorProps = {
  initial: QuizDraft | null
  save: (state: ActionResult | null, formData: FormData) => Promise<ActionResult>
}

const blankQuestion = (): QuizQuestionInput => ({ prompt: '', options: ['', '', ''], correctIndex: 0, explanation: '' })

// Editor do quiz do módulo; o quiz inteiro vai para a action como JSON
export function QuizEditor({ initial, save }: QuizEditorProps) {
  const [passPercent, setPassPercent] = useState(initial?.passPercent ?? 70)
  // Cada pergunta leva uma chave própria para o React não misturar os campos ao reordenar
  const [questions, setQuestions] = useState(() =>
    (initial?.questions.length ? initial.questions : [blankQuestion()]).map((question) => ({
      key: crypto.randomUUID(),
      question,
    })),
  )
  const { state, onSubmit, pending } = useFormAction<ActionResult | null>(save, null, 'Quiz salvo.')

  const update = (index: number, question: QuizQuestionInput) =>
    setQuestions((list) => list.map((item, i) => (i === index ? { ...item, question } : item)))
  const move = (index: number, direction: -1 | 1) =>
    setQuestions((list) => {
      const next = [...list]
      const [item] = next.splice(index, 1)
      if (item) next.splice(index + direction, 0, item)
      return next
    })
  const payload = JSON.stringify({ passPercent, questions: questions.map((item) => item.question) })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="quiz" value={payload} />
      <FormMessage>{state?.ok === false ? state.error : null}</FormMessage>
      <LabeledField
        label="Nota mínima para passar (%)"
        hint="O aluno pode refazer o quiz quantas vezes quiser."
        className="max-w-xs"
      >
        <Input
          type="number"
          min={50}
          max={100}
          step={5}
          value={passPercent}
          onChange={(event) => setPassPercent(Number(event.target.value))}
        />
      </LabeledField>
      {questions.map((item, index) => (
        <QuizQuestionCard
          key={item.key}
          index={index}
          total={questions.length}
          question={item.question}
          onChange={(question) => update(index, question)}
          onMove={(direction) => move(index, direction)}
          onRemove={() => setQuestions((list) => list.filter((_, i) => i !== index))}
        />
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton size="default" pending={pending} pendingLabel="Salvando…">
          Salvar quiz
        </SubmitButton>
        {questions.length < QUIZ_LIMITS.questions && (
          <Button
            type="button"
            variant="outline"
            className="border-dashed"
            onClick={() => setQuestions((list) => [...list, { key: crypto.randomUUID(), question: blankQuestion() }])}
          >
            <PlusIcon />
            Nova pergunta
          </Button>
        )}
      </div>
    </form>
  )
}
