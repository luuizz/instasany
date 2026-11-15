import { z } from 'zod'

export const COURSE_LEVELS = ['Iniciante', 'Intermediário', 'Avançado'] as const

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .transform((value) => value || null)
    .pipe(z.url(`${label}: use um endereço completo (https://...).`).nullable())

export const courseSchema = z.object({
  title: z.string().trim().min(3, 'Informe o nome do curso.').max(80, 'O nome pode ter até 80 caracteres.'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Endereço: só letras minúsculas, números e hífen (ex.: reels-que-vendem).')
    .max(60, 'O endereço pode ter até 60 caracteres.'),
  summary: z.string().trim().min(1, 'Escreva um resumo curto.').max(160, 'O resumo pode ter até 160 caracteres.'),
  description: z.string().trim().max(2000, 'A descrição pode ter até 2.000 caracteres.'),
  level: z.enum(COURSE_LEVELS, 'Escolha o nível do curso.'),
  coverUrl: optionalUrl('Capa'),
  published: z.boolean(),
})

export const moduleSchema = z.object({
  title: z.string().trim().min(2, 'Informe o nome do módulo.').max(80, 'O nome do módulo pode ter até 80 caracteres.'),
})

export const lessonSchema = z.object({
  title: z.string().trim().min(2, 'Informe o título da aula.').max(100, 'O título pode ter até 100 caracteres.'),
  content: z.string().trim().max(20_000, 'O texto da aula pode ter até 20.000 caracteres.'),
  videoUrl: optionalUrl('Vídeo'),
  durationMinutes: z.coerce
    .number('Informe a duração em minutos.')
    .int('Use minutos inteiros.')
    .min(0, 'A duração não pode ser negativa.')
    .max(600, 'A duração pode ter até 600 minutos.'),
})

export type CourseInput = z.output<typeof courseSchema>
export type LessonInput = z.output<typeof lessonSchema>
