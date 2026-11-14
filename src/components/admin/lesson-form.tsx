'use client'

import type { FormState } from '@/app/(admin)/admin/cursos/actions'
import { Field, Input, Textarea } from '@/components/ui/field'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import type { Lesson } from '@/types/lms'
import { FormStatus } from './form-status'
import { MediaField } from './media-field'

type LessonFormProps = {
  lesson: Lesson
  save: (state: FormState, formData: FormData) => Promise<FormState>
  uploadsEnabled: boolean
}

export function LessonForm({ lesson, save, uploadsEnabled }: LessonFormProps) {
  const { state, onSubmit, pending } = useFormAction(save, null as FormState)

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormStatus state={state} success="Aula salva." />
      <Field label="Título">
        <Input name="title" defaultValue={lesson.title} required maxLength={100} />
      </Field>
      <Field label="Duração (minutos)">
        <Input
          name="durationMinutes"
          type="number"
          min={0}
          max={600}
          defaultValue={lesson.durationMinutes}
          required
          className="max-w-40"
        />
      </Field>
      <MediaField
        name="videoUrl"
        label="Vídeo"
        kind="video"
        defaultValue={lesson.videoUrl}
        uploadsEnabled={uploadsEnabled}
        hint="Opcional: a aula pode ser só texto. Comprima antes de enviar (720p é suficiente)."
      />
      <Field label="Texto da aula" hint="Deixe uma linha em branco entre os parágrafos.">
        <Textarea name="content" defaultValue={lesson.content} rows={12} maxLength={20000} />
      </Field>
      <SubmitButton pending={pending} pendingLabel="Salvando…" className="self-start">
        Salvar aula
      </SubmitButton>
    </form>
  )
}
