import { trackEventAction } from '@/app/(site)/actions'
import { VISITOR_STORAGE_KEY } from '@/lib/analytics'
import type { ClientEvent } from '@/lib/validation/analytics'

type EventInput = ClientEvent extends infer Event
  ? Event extends ClientEvent
    ? Omit<Event, 'visitorId'>
    : never
  : never

// Respeita "não rastrear" e o Global Privacy Control do navegador
const allowed = () => {
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean }
  return nav.doNotTrack !== '1' && nav.globalPrivacyControl !== true
}

// Id aleatório do navegador, sem relação com a conta; some se a pessoa limpar os dados do site
function visitorId() {
  try {
    const saved = localStorage.getItem(VISITOR_STORAGE_KEY)
    if (saved) return saved
    const created = crypto.randomUUID()
    localStorage.setItem(VISITOR_STORAGE_KEY, created)
    return created
  } catch {
    return null
  }
}

export function track(event: EventInput) {
  if (!allowed()) return
  const id = visitorId()
  if (id) void trackEventAction({ ...event, visitorId: id })
}
