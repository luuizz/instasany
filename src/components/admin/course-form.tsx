'use client'

import type { FormState } from '@/app/(admin)/admin/cursos/actions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LabeledField } from '@/components/ui/form-field'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
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
  const { state, onSubmit, pending } = useFormAction(save, null as FormState, 'Curso salvo.')

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <FormStatus state={state} />
      <LabeledField label="Nome do curso">
        <Input name="title" defaultValue={course?.title} required maxLength={80} />
      </LabeledField>
      <LabeledField label="Endereço" hint="Aparece em /cursos/endereco. Deixe vazio para gerar a partir do nome.">
        <Input name="slug" defaultValue={course?.slug} maxLength={60} placeholder="instagram-do-zero" />
      </LabeledField>
      <LabeledField label="Resumo" hint="Uma frase, mostrada no catálogo.">
        <Input name="summary" defaultValue={course?.summary} required maxLength={160} />
      </LabeledField>
      <LabeledField label="Descrição">
        <Textarea name="description" defaultValue={course?.description} rows={5} maxLength={2000} />
      </LabeledField>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field className="gap-2">
          <FieldLabel htmlFor="curso-nivel" className="font-semibold">
            Nível
          </FieldLabel>
          <Select name="level" defaultValue={course?.level ?? COURSE_LEVELS[0]}>
            <SelectTrigger id="curso-nivel">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COURSE_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
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
      <Field orientation="horizontal" className="items-center gap-4 rounded-3xl border border-border bg-card p-4">
        <Switch id="curso-publicado" name="published" defaultChecked={course?.published} />
        <FieldContent>
          <FieldLabel htmlFor="curso-publicado" className="font-semibold">
            Publicado
          </FieldLabel>
          <FieldDescription className="text-xs">Aparece no catálogo e aceita matrículas.</FieldDescription>
        </FieldContent>
      </Field>
      <SubmitButton size="default" pending={pending} pendingLabel="Salvando…" className="self-start">
        {course ? 'Salvar curso' : 'Criar curso'}
      </SubmitButton>
    </form>
  )
}
