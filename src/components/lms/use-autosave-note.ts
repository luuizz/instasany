'use client'

import { useEffect, useRef, useState } from 'react'
import { saveNoteAction } from '@/app/(aluno)/aluno/actions'

export type SaveState = { status: 'idle' | 'pending' | 'saved' | 'error'; savedAt: Date | null; error?: string }

const DELAY = 900

// Salva a anotação um pouco depois que a pessoa para de digitar, e na hora ao sair do campo ou da página
export function useAutosaveNote(lessonId: number, initial: string, initialSavedAt: Date | null) {
  const [content, setContent] = useState(initial)
  const [state, setState] = useState<SaveState>({ status: 'idle', savedAt: initialSavedAt })
  const saved = useRef(initial)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef(initial)

  const flush = async () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    const text = latest.current
    if (text === saved.current) return
    setState((current) => ({ ...current, status: 'pending' }))
    const result = await saveNoteAction({ lessonId, content: text })
    if (result.ok) {
      saved.current = text
      setState({ status: 'saved', savedAt: new Date(result.data.savedAt) })
    } else {
      setState((current) => ({ ...current, status: 'error', error: result.error }))
    }
  }

  const change = (text: string) => {
    setContent(text)
    latest.current = text
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => void flush(), DELAY)
  }

  // Ao trocar de aula ou fechar a aba, não perde o que ainda não foi salvo
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') void flush()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      void flush()
    }
    // flush lê só refs; registrar uma vez por aula basta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId])

  return { content, change, flush, state }
}
