'use client'

import { AlertCircleIcon, CheckIcon, LoaderCircleIcon, NotebookPenIcon } from 'lucide-react'
import Link from 'next/link'
import { Textarea } from '@/components/ui/textarea'
import { NOTE_MAX_LENGTH } from '@/lib/validation/lms'
import { cn } from '@/lib/utils'
import { useAutosaveNote, type SaveState } from './use-autosave-note'

const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

function Status({ state }: { state: SaveState }) {
  if (state.status === 'pending')
    return (
      <span className="flex items-center gap-1.5">
        <LoaderCircleIcon className="size-3.5 animate-spin" />
        Salvando…
      </span>
    )
  if (state.status === 'error')
    return (
      <span className="flex items-center gap-1.5 text-destructive">
        <AlertCircleIcon className="size-3.5" />
        {state.error}
      </span>
    )
  if (state.savedAt)
    return (
      <span className="flex items-center gap-1.5">
        <CheckIcon className="size-3.5 text-sage" />
        Salvo às {time.format(state.savedAt)}
      </span>
    )
  return <span>As anotações são salvas sozinhas</span>
}

type LessonNotesProps = { lessonId: number; initial: string; savedAt: Date | null }

// Bloco de notas da aula: só a pessoa vê, e tudo fica reunido em Minhas anotações
export function LessonNotes({ lessonId, initial, savedAt }: LessonNotesProps) {
  const { content, change, flush, state } = useAutosaveNote(lessonId, initial, savedAt)
  const near = content.length > NOTE_MAX_LENGTH * 0.9

  return (
    <section aria-labelledby="anotacoes" className="rounded-3xl bg-card p-5 ring-1 ring-border sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="anotacoes" className="flex items-center gap-2 text-lg font-semibold text-ink">
          <NotebookPenIcon className="size-5 text-sage" />
          Minhas anotações
        </h2>
        <Link href="/aluno/anotacoes" className="text-sm font-semibold text-pine hover:underline dark:text-lime">
          Ver todas
        </Link>
      </div>
      <Textarea
        value={content}
        onChange={(event) => change(event.target.value)}
        onBlur={() => void flush()}
        maxLength={NOTE_MAX_LENGTH}
        rows={5}
        placeholder="Anote ideias, exemplos para o seu perfil ou o que quer revisar depois. Só você vê."
        aria-describedby="anotacoes-status"
        className="min-h-32 resize-y"
      />
      <div id="anotacoes-status" aria-live="polite" className="mt-2 flex justify-between gap-3 text-xs text-ink/50">
        <Status state={state} />
        <span className={cn('tabular-nums', near && 'text-destructive')}>
          {content.length.toLocaleString('pt-BR')}/{NOTE_MAX_LENGTH.toLocaleString('pt-BR')}
        </span>
      </div>
    </section>
  )
}
