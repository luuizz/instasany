'use client'

import { BookOpenIcon, ClockIcon, SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { searchCatalogAction } from '@/app/(site)/actions'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { countLabel, formatDuration } from '@/lib/duration'
import type { CatalogCourse } from '@/types/lms'

// Busca do site: abre num painel (botão, tecla / ou ⌘K / Ctrl+K) e procura nos cursos pelo título,
// resumo, nível e pelos nomes dos módulos e aulas. O catálogo é carregado na primeira abertura.
export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [courses, setCourses] = useState<CatalogCourse[] | null>(null)
  const [loading, startLoading] = useTransition()

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]')
      const shortcut =
        (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)
      if (shortcut) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open && courses === null) startLoading(async () => setCourses(await searchCatalogAction()))
  }, [open, courses])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      {compact ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Buscar cursos"
          onClick={() => setOpen(true)}
          className="text-paper hover:bg-paper/10 hover:text-paper"
        >
          <SearchIcon className="size-5" />
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buscar cursos"
          className="flex h-10 items-center gap-2 rounded-full bg-paper/10 pr-2 pl-3.5 text-sm whitespace-nowrap text-paper/75 transition hover:bg-paper/15 hover:text-paper focus-visible:ring-4 focus-visible:ring-lime/30 focus-visible:outline-none"
        >
          <SearchIcon className="size-4" />
          <span aria-hidden className="hidden xl:inline xl:in-data-scrolled:hidden">
            Buscar cursos
          </span>
          <kbd className="rounded-md bg-paper/10 px-2 py-0.5 font-sans text-xs text-paper/60">/</kbd>
        </button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Buscar cursos"
        description="Procure por curso, assunto ou nome de aula"
        className="rounded-3xl sm:max-w-xl"
      >
        <CommandInput placeholder="Ex.: reels, bio, primeiro cliente…" />
        <CommandList className="max-h-96">
          {loading || courses === null ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Carregando cursos…</p>
          ) : (
            <>
              <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
              <CommandGroup heading="Cursos">
                {courses.map((course) => (
                  <CommandItem
                    key={course.id}
                    value={`${course.title} ${course.slug}`}
                    keywords={[course.summary, course.level, ...course.keywords]}
                    onSelect={() => go(`/cursos/${course.slug}`)}
                    className="flex-col items-start gap-1 rounded-2xl px-3 py-2.5"
                  >
                    <span className="font-semibold text-ink">{course.title}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">{course.summary}</span>
                    <span className="flex items-center gap-3 text-xs text-sage">
                      <span>{course.level}</span>
                      <span className="flex items-center gap-1">
                        <BookOpenIcon className="size-3!" />
                        {countLabel(course.lessonCount, 'aula', 'aulas')}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="size-3!" />
                        {formatDuration(course.totalMinutes)}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Atalhos">
                <CommandItem value="ver todos os cursos" onSelect={() => go('/cursos')} className="rounded-2xl">
                  Ver todos os cursos
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
