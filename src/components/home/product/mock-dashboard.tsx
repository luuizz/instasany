import { AwardIcon, BookOpenIcon, CheckIcon, HomeIcon, LockIcon, PlayIcon, UserRoundIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const week = [
  { day: 'seg', count: 2 },
  { day: 'ter', count: 4 },
  { day: 'qua', count: 1 },
  { day: 'qui', count: 5 },
  { day: 'sex', count: 3 },
  { day: 'sáb', count: 6 },
  { day: 'hoje', count: 4 },
]
const lessons = [
  { title: 'Definindo seu nicho', minutes: 12, state: 'done' },
  { title: 'Bio que converte', minutes: 10, state: 'current' },
  { title: 'Os 3 tipos de post que trazem seguidores', minutes: 14, state: 'next' },
] as const
const tiles = [
  { value: '2', label: 'em andamento' },
  { value: '14', label: 'aulas feitas' },
  { value: '1', label: 'certificado' },
]

// Prévia ilustrativa da área do aluno, desenhada em HTML (os data-anim são animados pelo bento)
export function MockDashboard() {
  const max = Math.max(...week.map((item) => item.count))
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-paper text-ink shadow-2xl shadow-ink/40">
      <div className="flex items-center gap-2 border-b border-ink/5 px-4 py-3">
        <span className="size-2.5 rounded-full bg-ink/15" />
        <span className="size-2.5 rounded-full bg-ink/15" />
        <span className="size-2.5 rounded-full bg-ink/15" />
        <span className="ml-3 truncate rounded-full bg-secondary px-3 py-1 text-2xs text-ink/65 sm:text-xs">
          instasany.com.br/aluno
        </span>
      </div>
      <div className="flex flex-1">
        <nav className="hidden flex-col items-center gap-4 bg-pine px-3 py-5 text-paper/65 sm:flex">
          <HomeIcon className="size-4 text-lime" />
          <BookOpenIcon className="size-4" />
          <AwardIcon className="size-4" />
          <UserRoundIcon className="size-4" />
        </nav>
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
          <p className="text-lg font-semibold">Olá, Marina!</p>
          <div data-anim="continue" className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
            <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-pine">
              <span data-anim="ping" className="absolute inset-0 rounded-xl ring-2 ring-lime/60" />
              <PlayIcon className="ml-0.5 size-5 fill-lime text-lime" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-2xs text-ink/65 sm:text-xs">Continue de onde parou</span>
              <span className="block truncate text-sm font-semibold">Bio que converte</span>
              <span className="mt-2 flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper">
                  <span data-anim="progress" className="block h-full w-3/5 origin-left rounded-full bg-sage" />
                </span>
                <span className="text-2xs font-semibold text-ink/65 tabular-nums">60%</span>
              </span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {tiles.map((tile) => (
              <span key={tile.label} data-anim="tile" className="rounded-xl bg-secondary/60 p-2.5">
                <span className="block text-lg font-semibold tabular-nums">{tile.value}</span>
                <span className="block truncate text-2xs text-ink/65">{tile.label}</span>
              </span>
            ))}
          </div>
          <ol className="hidden flex-col gap-1.5 lg:flex">
            {lessons.map((lesson) => (
              <li
                key={lesson.title}
                data-anim="lesson"
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs',
                  lesson.state === 'current' ? 'bg-lime/40 font-semibold' : 'bg-secondary/40',
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full',
                    lesson.state === 'done' ? 'bg-pine text-lime' : 'bg-paper text-ink/65 ring-1 ring-ink/10',
                  )}
                >
                  {lesson.state === 'done' && <CheckIcon data-anim="lesson-check" className="size-3" strokeWidth={3} />}
                  {lesson.state === 'current' && <PlayIcon className="ml-px size-2.5 fill-pine text-pine" />}
                  {lesson.state === 'next' && <LockIcon className="size-2.5" />}
                </span>
                <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                <span className="text-2xs text-ink/65">{lesson.minutes} min</span>
              </li>
            ))}
          </ol>
          <div className="mt-auto">
            <p className="mb-2 text-xs font-semibold">Sua semana</p>
            <div className="flex h-20 items-end gap-1.5">
              {week.map((item, index) => (
                <span key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span
                    data-anim="bar"
                    className={cn(
                      'w-full origin-bottom rounded-t-md',
                      index === week.length - 1 ? 'bg-pine' : 'bg-sage/60',
                    )}
                    style={{ height: `${(item.count / max) * 100}%` }}
                  />
                  <span className="text-2xs text-ink/65">{item.day}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
