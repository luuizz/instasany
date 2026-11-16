'use client'

import { SearchIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { COURSE_LEVELS } from '@/lib/validation/lms'
import { cn } from '@/lib/utils'
import type { CatalogCourse, CourseLevel } from '@/types/lms'
import { CourseCard } from './course-card'

// Busca sem diferença de acento e maiúscula ("vídeo" acha "video")
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

// Listagem pública: busca por texto (título, resumo, módulos e aulas) e filtro por nível
export function CourseCatalog({ courses }: { courses: CatalogCourse[] }) {
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState<CourseLevel | null>(null)
  const levels = COURSE_LEVELS.filter((option) => courses.some((course) => course.level === option))

  const terms = normalize(query).split(/\s+/).filter(Boolean)
  const visible = courses.filter((course) => {
    if (level && course.level !== level) return false
    const haystack = normalize([course.title, course.summary, course.level, ...course.keywords].join(' '))
    return terms.every((term) => haystack.includes(term))
  })

  const clear = () => {
    setQuery('')
    setLevel(null)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <SearchIcon aria-hidden className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/65" />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por curso, assunto ou aula"
            aria-label="Buscar cursos"
            className="pl-11"
          />
        </div>
        <div role="group" aria-label="Filtrar por nível" className="flex flex-wrap gap-2">
          {[null, ...levels].map((option) => (
            <button
              key={option ?? 'todos'}
              type="button"
              aria-pressed={level === option}
              onClick={() => setLevel(option)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition',
                level === option
                  ? 'border-pine bg-pine text-lime'
                  : 'border-ink/10 bg-paper text-ink/70 hover:border-sage hover:text-ink',
              )}
            >
              {option ?? 'Todos os níveis'}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-ink/65">
        {visible.length === courses.length
          ? `${courses.length} ${courses.length === 1 ? 'curso' : 'cursos'}`
          : `${visible.length} de ${courses.length} cursos`}
      </p>

      <h2 className="sr-only">Cursos encontrados</h2>
      {visible.length ? (
        <ul aria-label="Cursos encontrados" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course, index) => (
            <li
              key={course.id}
              className="animate-in duration-500 fill-mode-both fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <CourseCard course={course} href={`/cursos/${course.slug}`} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-ink/15 px-6 py-16 text-center">
          <p className="text-lg font-semibold text-ink">Nenhum curso com esse filtro</p>
          <p className="text-ink/65">Tente outra palavra ou veja todos os níveis.</p>
          <Button type="button" variant="outline" size="default" onClick={clear}>
            <XIcon />
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
