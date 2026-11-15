'use client'

import type { FormState } from '@/app/(admin)/admin/cursos/actions'
import { Field, Input, Textarea } from '@/components/ui/field'
import { Select } from '@/components/ui/select'
import { SubmitButton } from '@/components/ui/submit-button'
import { useFormAction } from '@/hooks/use-form-action'
import { COURSE_LEVELS } from '@/lib/validation/lms'
import type { CourseOutline } from '@/types/lms'
import { FormStatus } from './form-status'
import { MediaField } from './media-field'

type CourseFormProps = {
  course?: CourseOutline
  save: (state: FormState, formData: FormData) => Promise<FormState>
  uploadsEnabled: boolean
}

export function CourseForm({ course, save, uploadsEnabled }: CourseFormProps) {
  const { state, onSubmit, pending } = useFormAction(save, null as FormState)

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormStatus state={state} success="Curso salvo." />
      <Field label="Nome do curso">
        <Input name="title" defaultValue={course?.title} required maxLength={80} />
      </Field>
      <Field label="Endereço" hint="Aparece em /cursos/endereco. Deixe vazio para gerar a partir do nome.">
        <Input name="slug" defaultValue={course?.slug} maxLength={60} placeholder="instagram-do-zero" />
      </Field>
      <Field label="Resumo" hint="Uma frase, mostrada no catálogo.">
        <Input name="summary" defaultValue={course?.summary} required maxLength={160} />
      </Field>
      <Field label="Descrição">
        <Textarea name="description" defaultValue={course?.description} rows={5} maxLength={2000} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nível">
          <Select name="level" defaultValue={course?.level ?? COURSE_LEVELS[0]}>
            {COURSE_LEVELS.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </Select>
        </Field>
      </div>
      <MediaField
        name="coverUrl"
        label="Capa"
        kind="image"
        defaultValue={course?.coverUrl ?? null}
        uploadsEnabled={uploadsEnabled}
        hint="Opcional. Proporção 16:9."
      />
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name="published" defaultChecked={course?.published} className="size-5 accent-pine" />
        Publicado (aparece no catálogo e aceita matrículas)
      </label>
      <SubmitButton pending={pending} pendingLabel="Salvando…" className="self-start">
        {course ? 'Salvar curso' : 'Criar curso'}
      </SubmitButton>
    </form>
  )
}
