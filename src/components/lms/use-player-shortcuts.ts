'use client'

import { useEffect, useRef, type RefObject } from 'react'

type Controls = {
  video: RefObject<HTMLVideoElement | null>
  frame: RefObject<HTMLDivElement | null>
  toggle: () => void
  seek: (seconds: number) => void
  toggleMute: () => void
  changeSpeed: (step: 0 | 1 | -1) => void
  toggleFullscreen: () => void
  show: (text: string) => void
  openHelp: () => void
}

export const PLAYER_SHORTCUTS = [
  { keys: ['Espaço', 'K'], label: 'Reproduzir ou pausar' },
  { keys: ['←', '→'], label: 'Voltar ou avançar 5 segundos' },
  { keys: ['J', 'L'], label: 'Voltar ou avançar 10 segundos' },
  { keys: ['0 a 9'], label: 'Ir para 0% a 90% do vídeo' },
  { keys: ['<', '>'], label: 'Diminuir ou aumentar a velocidade' },
  { keys: ['M'], label: 'Tirar ou ativar o som' },
  { keys: ['F'], label: 'Tela cheia' },
  { keys: ['?'], label: 'Mostrar estes atalhos' },
]

// Quem está digitando (anotação, dúvida, busca) não aciona atalho
function isTyping(target: EventTarget | null) {
  const element = target as HTMLElement | null
  if (!element) return false
  return element.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
}

// Atalhos do player valendo na página toda da aula, como no YouTube
export function usePlayerShortcuts(controls: Controls) {
  const ref = useRef(controls)
  useEffect(() => {
    ref.current = controls
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented || isTyping(event.target)) return
      // Espaço só pausa quando o foco não está num botão ou link (ali ele já tem função)
      const target = event.target as HTMLElement
      const onControl = ['BUTTON', 'A'].includes(target.tagName) && !ref.current.frame.current?.contains(target)
      const c = ref.current
      const element = c.video.current
      if (!element) return
      const now = element.currentTime
      const jump = (delta: number) => {
        c.seek(now + delta)
        c.show(`${delta > 0 ? '+' : '−'}${Math.abs(delta)}s`)
      }
      const key = event.key.toLowerCase()
      const actions: Record<string, () => void> = {
        ' ': c.toggle,
        k: c.toggle,
        arrowright: () => jump(5),
        arrowleft: () => jump(-5),
        l: () => jump(10),
        j: () => jump(-10),
        m: c.toggleMute,
        f: c.toggleFullscreen,
        '>': () => c.changeSpeed(1),
        '<': () => c.changeSpeed(-1),
        '?': c.openHelp,
      }
      if (/^[0-9]$/.test(key) && element.duration) {
        event.preventDefault()
        c.seek((element.duration * Number(key)) / 10)
        c.show(`${Number(key) * 10}%`)
        return
      }
      const action = actions[key]
      if (!action || (key === ' ' && onControl)) return
      event.preventDefault()
      action()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])
}
