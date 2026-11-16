// Conquistas calculadas a partir do progresso; nada é gravado, então mudar uma regra vale para todos na hora

export type AchievementCounts = {
  lessonsDone: number
  modulesDone: number
  perfectQuizzes: number
  coursesDone: number
  certificates: number
  notes: number
  longestStreak: number
}

export type Achievement = {
  id: string
  title: string
  description: string
  progress: number
  target: number
  unlocked: boolean
}

const rules: { id: string; title: string; description: string; key: keyof AchievementCounts; target: number }[] = [
  {
    id: 'primeira-aula',
    title: 'Primeiro passo',
    description: 'Concluir a primeira aula',
    key: 'lessonsDone',
    target: 1,
  },
  { id: 'dez-aulas', title: 'Embalado', description: 'Concluir 10 aulas', key: 'lessonsDone', target: 10 },
  {
    id: 'modulo',
    title: 'Módulo fechado',
    description: 'Concluir todas as aulas de um módulo',
    key: 'modulesDone',
    target: 1,
  },
  {
    id: 'gabarito',
    title: 'Gabaritou',
    description: 'Acertar todas as questões de um quiz',
    key: 'perfectQuizzes',
    target: 1,
  },
  { id: 'anotador', title: 'Caderno em dia', description: 'Fazer anotações em 5 aulas', key: 'notes', target: 5 },
  { id: 'sequencia-3', title: 'Constância', description: 'Estudar 3 dias seguidos', key: 'longestStreak', target: 3 },
  {
    id: 'sequencia-7',
    title: 'Semana completa',
    description: 'Estudar 7 dias seguidos',
    key: 'longestStreak',
    target: 7,
  },
  {
    id: 'curso',
    title: 'Curso concluído',
    description: 'Concluir todas as aulas de um curso',
    key: 'coursesDone',
    target: 1,
  },
  {
    id: 'certificado',
    title: 'Certificado na mão',
    description: 'Emitir o primeiro certificado',
    key: 'certificates',
    target: 1,
  },
]

export function buildAchievements(counts: AchievementCounts): Achievement[] {
  return rules.map(({ key, target, ...rule }) => {
    const progress = Math.min(counts[key], target)
    return { ...rule, target, progress, unlocked: counts[key] >= target }
  })
}
