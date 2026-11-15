import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LabeledField } from '@/components/ui/form-field'
import type { CmsScalarField } from '@/types/cms'

type CmsScalarInputProps = { field: CmsScalarField; name: string; value: unknown }

const asText = (value: unknown) => (Array.isArray(value) ? value.join('\n') : value == null ? '' : String(value))

export function CmsScalarInput({ field, name, value }: CmsScalarInputProps) {
  const required = !field.optional

  if (field.kind === 'checkbox') {
    return (
      <div className="flex items-center gap-3">
        <Checkbox id={name} name={name} defaultChecked={value === true} />
        <Label htmlFor={name} className="font-semibold">
          {field.label}
        </Label>
      </div>
    )
  }

  return (
    <LabeledField label={field.label} hint={field.hint}>
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
    </LabeledField>
  )
}
