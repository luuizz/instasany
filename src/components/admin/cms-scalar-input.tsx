import { Field, Input, Textarea } from '@/components/ui/field'
import type { CmsScalarField } from '@/types/cms'

type CmsScalarInputProps = { field: CmsScalarField; name: string; value: unknown }

const asText = (value: unknown) => (Array.isArray(value) ? value.join('\n') : value == null ? '' : String(value))

export function CmsScalarInput({ field, name, value }: CmsScalarInputProps) {
  const required = !field.optional

  if (field.kind === 'checkbox') {
    return (
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" name={name} defaultChecked={value === true} className="size-5 accent-pine" />
        {field.label}
      </label>
    )
  }

  return (
    <Field label={field.label} hint={field.hint}>
      {field.kind === 'textarea' || field.kind === 'lines' ? (
        <Textarea name={name} defaultValue={asText(value)} required={required} rows={field.kind === 'lines' ? 5 : 3} />
      ) : (
        <Input
          name={name}
          defaultValue={asText(value)}
          required={required}
          {...(field.kind === 'number' && { type: 'number', min: 0, step: 0.01, inputMode: 'decimal' as const })}
        />
      )}
    </Field>
  )
}
