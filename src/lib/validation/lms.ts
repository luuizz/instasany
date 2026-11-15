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
  releaseAfterDays: z.coerce
    .number('Informe em quantos dias a aula abre.')
    .int('Use dias inteiros.')
    .min(0, 'Use 0 para abrir junto com a matrícula.')
    .max(365, 'O prazo pode ter até 365 dias.'),
})

export type CourseInput = z.output<typeof courseSchema>
export type LessonInput = z.output<typeof lessonSchema>

export const attachmentSchema = z.object({
  title: z.string().trim().min(1, 'Dê um nome ao material.').max(120, 'O nome pode ter até 120 caracteres.'),
  url: z.url('Informe um endereço completo (https://...).'),
  sizeBytes: z.number().int().min(0).default(0),
  contentType: z.string().max(200).default(''),
})

export const lessonPositionSchema = z.object({
  lessonId: z.number().int().positive(),
  seconds: z
    .number()
    .int()
    .min(0)
    .max(24 * 60 * 60),
})

export const QUIZ_LIMITS = { questions: 30, minOptions: 2, maxOptions: 5 } as const

const quizQuestionSchema = z
  .object({
    prompt: z
      .string()
      .trim()
      .min(3, 'Escreva o enunciado de cada pergunta.')
      .max(300, 'O enunciado pode ter até 300 caracteres.'),
    options: z
      .array(
        z
          .string()
          .trim()
          .min(1, 'Preencha todas as alternativas.')
          .max(200, 'Cada alternativa pode ter até 200 caracteres.'),
      )
      .min(QUIZ_LIMITS.minOptions, `Cada pergunta precisa de pelo menos ${QUIZ_LIMITS.minOptions} alternativas.`)
      .max(QUIZ_LIMITS.maxOptions, `Cada pergunta pode ter até ${QUIZ_LIMITS.maxOptions} alternativas.`),
    correctIndex: z.number().int().min(0),
    explanation: z.string().trim().max(500, 'A explicação pode ter até 500 caracteres.').default(''),
  })
  .refine((question) => question.correctIndex < question.options.length, {
    message: 'Marque a alternativa certa de cada pergunta.',
  })

export const quizSchema = z.object({
  passPercent: z
    .number()
    .int()
    .min(50, 'A nota mínima vai de 50% a 100%.')
    .max(100, 'A nota mínima vai de 50% a 100%.'),
  questions: z
    .array(quizQuestionSchema)
    .min(1, 'Adicione pelo menos uma pergunta.')
    .max(QUIZ_LIMITS.questions, `O quiz pode ter até ${QUIZ_LIMITS.questions} perguntas.`),
})

export const quizAnswersSchema = z.object({
  quizId: z.number().int().positive(),
  answers: z.array(z.number().int().min(-1)).max(QUIZ_LIMITS.questions),
})

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Escolha de 1 a 5 estrelas.').max(5, 'Escolha de 1 a 5 estrelas.'),
  comment: z.string().trim().max(600, 'O comentário pode ter até 600 caracteres.').default(''),
})

export const questionMessageSchema = z.object({
  body: z.string().trim().min(2, 'Escreva sua mensagem.').max(2000, 'A mensagem pode ter até 2.000 caracteres.'),
})
