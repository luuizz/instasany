'use client'

import { useEffect } from 'react'
import { track } from '@/components/analytics/track'
import { MAX_WATCH_SECONDS, WATCH_FLUSH_SECONDS } from '@/lib/analytics'

// Mede quanto do vídeo foi assistido: soma o avanço normal do tempo (pulos ficam de fora)
// e envia em blocos, ao pausar, terminar ou sair da página. O primeiro play vira um evento.
export function useWatchTracking(video: React.RefObject<HTMLVideoElement | null>, lessonId?: number) {
  useEffect(() => {
    const element = video.current
    if (!element || !lessonId) return
    let started = false
    let pending = 0
    let last: number | null = null

    const flush = () => {
      const seconds = Math.min(Math.round(pending), MAX_WATCH_SECONDS)
      pending = 0
      if (seconds >= 1) track({ type: 'video_watch', lessonId, seconds })
    }
    const onPlay = () => {
      last = element.currentTime
      if (started) return
      started = true
      track({ type: 'video_play', lessonId, seconds: 0 })
    }
    const onTime = () => {
      if (element.paused || last === null) return
      const delta = element.currentTime - last
      last = element.currentTime
      if (delta > 0 && delta < 2) pending += delta
      if (pending >= WATCH_FLUSH_SECONDS) flush()
    }
    const onSeeked = () => {
      last = element.currentTime
    }
    const onStop = () => {
      last = null
      flush()
    }

    const listeners: [string, () => void][] = [
      ['play', onPlay],
      ['timeupdate', onTime],
      ['seeked', onSeeked],
      ['pause', onStop],
      ['ended', onStop],
    ]
    listeners.forEach(([name, handler]) => element.addEventListener(name, handler))
    window.addEventListener('pagehide', flush)
    return () => {
      listeners.forEach(([name, handler]) => element.removeEventListener(name, handler))
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [video, lessonId])
}
