'use client'

import { ArrowRightIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import type { StudentNote } from '@/types/lms'

const date = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

// Anotações agrupadas por curso, com busca no texto e no nome da aula
export function NotesList({ notes }: { notes: StudentNote[] }) {
  const [query, setQuery] = useState('')
  const term = normalize(query.trim())
  const visible = term
    ? notes.filter((note) => normalize(`${note.lessonTitle} ${note.courseTitle} ${note.content}`).includes(term))
    : notes
  const courses = [...new Set(visible.map((note) => note.courseTitle))]

  return (
    <div className="flex flex-col gap-8">
      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/40" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar nas anotações"
          aria-label="Buscar nas anotações"
          className="pl-11"
        />
      </div>
      {courses.length === 0 && <p className="text-ink/60">Nenhuma anotação com “{query}”.</p>}
      {courses.map((course) => (
        <section key={course} aria-label={course} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-ink">{course}</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {visible
              .filter((note) => note.courseTitle === course)
              .map((note) => (
                <li key={note.lessonId} className="flex flex-col gap-3 rounded-3xl bg-card p-5 ring-1 ring-border">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-ink">{note.lessonTitle}</h3>
                    <span className="shrink-0 text-xs text-ink/45">{date.format(new Date(note.updatedAt))}</span>
                  </div>
                  <p className="line-clamp-6 text-sm whitespace-pre-wrap text-ink/70">{note.content}</p>
                  <Link
                    href={`/aluno/cursos/${note.courseSlug}/aulas/${note.lessonId}`}
                    className="mt-auto flex items-center gap-1 self-start text-sm font-semibold text-pine hover:underline dark:text-lime"
                  >
                    Abrir a aula
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
