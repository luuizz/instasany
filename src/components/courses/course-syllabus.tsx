import { FileTextIcon, PlayCircleIcon } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { countLabel, formatDuration } from '@/lib/duration'
import type { ModuleItem } from '@/types/lms'

// Ementa: módulos (Accordion do shadcn) e aulas, com duração e indicação de vídeo
export function CourseSyllabus({ modules }: { modules: ModuleItem[] }) {
  return (
    <Accordion
      type="multiple"
      defaultValue={modules[0] ? [`modulo-${modules[0].id}`] : []}
      className="flex flex-col gap-3"
    >
      {modules.map((module, index) => (
        <AccordionItem
          key={module.id}
          value={`modulo-${module.id}`}
          className="rounded-3xl border border-border px-6 last:border-b"
        >
          <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
            <span className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-1">
              <span>
                <span className="block text-sm font-normal text-sage">Módulo {index + 1}</span>
                <span className="text-base font-semibold text-ink">{module.title}</span>
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                {countLabel(module.lessons.length, 'aula', 'aulas')} ·{' '}
                {formatDuration(module.lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0))}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ol className="flex flex-col gap-3 pb-1">
              {module.lessons.map((lesson) => (
                <li key={lesson.id} className="flex items-center gap-3 text-base text-ink/70">
                  {lesson.hasVideo ? (
                    <PlayCircleIcon className="size-4 shrink-0 text-sage" aria-label="Vídeo" />
                  ) : (
                    <FileTextIcon className="size-4 shrink-0 text-sage" aria-label="Texto" />
                  )}
                  <span className="flex-1">{lesson.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{lesson.durationMinutes} min</span>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
