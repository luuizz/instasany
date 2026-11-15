import { z } from 'zod'
import { MAX_WATCH_SECONDS } from '@/lib/analytics'
import { ROLES } from '@/lib/roles'

const visitorId = z.uuid()

export const clientEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('page_view'),
    visitorId,
    path: z.string().startsWith('/').max(300),
  }),
  z.object({
    type: z.enum(['video_play', 'video_watch']),
    visitorId,
    lessonId: z.number().int().positive(),
    seconds: z.number().int().min(0).max(MAX_WATCH_SECONDS),
  }),
])

export type ClientEvent = z.output<typeof clientEventSchema>

export const roleSchema = z.object({ role: z.enum(ROLES, 'Escolha um papel válido.') })
