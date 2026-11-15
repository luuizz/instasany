import { CheckCircle2Icon, EyeIcon, GraduationCapIcon, PlayCircleIcon } from 'lucide-react'
import { formatDateTime } from '@/lib/dates'
import type { ActivityItem } from '@/types/students'

const describe = (item: ActivityItem) => {
  switch (item.type) {
    case 'enrollment':
      return { icon: <GraduationCapIcon />, text: `Matriculou-se em ${item.courseTitle}` }
    case 'lesson_complete':
      return { icon: <CheckCircle2Icon />, text: `Concluiu "${item.lessonTitle}"` }
    case 'video_play':
      return { icon: <PlayCircleIcon />, text: `Deu play em "${item.lessonTitle}"` }
    default:
      return { icon: <EyeIcon />, text: `Abriu ${item.path}` }
  }
}

// Linha do tempo com o que a pessoa fez por último
export function ActivityList({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="rounded-2xl bg-muted p-6 text-sm text-muted-foreground">Nenhuma atividade registrada ainda.</p>
  }
  return (
    <ol className="flex flex-col">
      {items.map((item, index) => {
        const { icon, text } = describe(item)
        return (
          <li key={index} className="flex gap-3 border-b border-border py-3 last:border-none">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary text-pine [&_svg]:size-4">
              {icon}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm text-ink">{text}</span>
              {item.createdAt && (
                <span className="block text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</span>
              )}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
