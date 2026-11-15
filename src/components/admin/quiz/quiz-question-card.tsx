'use client'

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LabeledField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { QUIZ_LIMITS } from '@/lib/validation/lms'
import type { QuizQuestionInput } from '@/types/lms'

type QuizQuestionCardProps = {
  index: number
  total: number
  question: QuizQuestionInput
  onChange: (question: QuizQuestionInput) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
}

const letter = (index: number) => String.fromCharCode(65 + index)

// Uma pergunta do editor: enunciado, alternativas (a marcada é a certa) e explicação
export function QuizQuestionCard({ index, total, question, onChange, onMove, onRemove }: QuizQuestionCardProps) {
  const set = (patch: Partial<QuizQuestionInput>) => onChange({ ...question, ...patch })
  const setOption = (optionIndex: number, value: string) =>
    set({ options: question.options.map((option, i) => (i === optionIndex ? value : option)) })
  const removeOption = (optionIndex: number) =>
    set({
      options: question.options.filter((_, i) => i !== optionIndex),
      correctIndex:
        question.correctIndex === optionIndex
          ? 0
          : question.correctIndex > optionIndex
            ? question.correctIndex - 1
            : question.correctIndex,
    })

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">Pergunta {index + 1}</h3>
        <div className="flex">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            aria-label={`Subir pergunta ${index + 1}`}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            aria-label={`Descer pergunta ${index + 1}`}
          >
            <ArrowDownIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={total === 1}
            onClick={onRemove}
            aria-label={`Remover pergunta ${index + 1}`}
            className="text-destructive hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
      <LabeledField label="Enunciado">
        <Textarea
          value={question.prompt}
          onChange={(event) => set({ prompt: event.target.value })}
          rows={2}
          maxLength={300}
        />
      </LabeledField>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">Alternativas · marque a certa</legend>
        <RadioGroup
          value={String(question.correctIndex)}
          onValueChange={(value) => set({ correctIndex: Number(value) })}
          aria-label={`Alternativa certa da pergunta ${index + 1}`}
          className="gap-2"
        >
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center gap-3">
              <RadioGroupItem value={String(optionIndex)} aria-label={`Alternativa ${letter(optionIndex)} é a certa`} />
              <Input
                value={option}
                onChange={(event) => setOption(optionIndex, event.target.value)}
                placeholder={`Alternativa ${letter(optionIndex)}`}
                aria-label={`Alternativa ${letter(optionIndex)}`}
                maxLength={200}
                className="h-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={question.options.length <= QUIZ_LIMITS.minOptions}
                onClick={() => removeOption(optionIndex)}
                aria-label={`Remover alternativa ${letter(optionIndex)}`}
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </RadioGroup>
        {question.options.length < QUIZ_LIMITS.maxOptions && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => set({ options: [...question.options, ''] })}
          >
            <PlusIcon />
            Alternativa
          </Button>
        )}
      </fieldset>
      <LabeledField label="Explicação" hint="Opcional: aparece para o aluno depois que ele responde.">
        <Textarea
          value={question.explanation}
          onChange={(event) => set({ explanation: event.target.value })}
          rows={2}
          maxLength={500}
        />
      </LabeledField>
    </section>
  )
}
