'use client'

import type { FormState } from '@/app/(admin)/admin/cursos/actions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LabeledField } from '@/components/ui/form-field'
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
  const { state, onSubmit, pending } = useFormAction(save, null as FormState, 'Aula salva.')

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <FormStatus state={state} />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:gap-10">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-[minmax(0,1fr)_9rem] gap-4">
            <LabeledField label="Título">
              <Input name="title" defaultValue={lesson.title} required maxLength={100} />
            </LabeledField>
            <LabeledField label="Duração (min)">
              <Input
                name="durationMinutes"
                type="number"
                min={0}
                max={600}
                defaultValue={lesson.durationMinutes}
                required
              />
            </LabeledField>
          </div>
          <LabeledField label="Texto da aula" hint="Deixe uma linha em branco entre os parágrafos.">
            <Textarea name="content" defaultValue={lesson.content} rows={14} maxLength={20000} />
          </LabeledField>
        </div>
        <MediaField
          name="videoUrl"
          label="Vídeo"
          kind="video"
          defaultValue={lesson.videoUrl}
          uploadsEnabled={uploadsEnabled}
          hint="Opcional: a aula pode ser só texto. Comprima antes de enviar (720p é suficiente)."
        />
      </div>
      <SubmitButton size="default" pending={pending} pendingLabel="Salvando…" className="self-start">
        Salvar aula
      </SubmitButton>
    </form>
  )
}
