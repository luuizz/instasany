'use client'

import { useEffect, useRef, useState } from 'react'
import { saveLessonPositionAction } from '@/app/(aluno)/aluno/actions'

const SAVE_EVERY_SECONDS = 15
// Perto do começo ou do fim não vale retomar: começa do início
const MIN_RESUME = 5
const END_MARGIN = 15

// Volta o vídeo para onde a pessoa parou e guarda a posição enquanto ela assiste
export function useResumePosition(
  video: React.RefObject<HTMLVideoElement | null>,
  seek: (seconds: number) => void,
  lessonId?: number,
  startAt = 0,
) {
  const [resumedFrom, setResumedFrom] = useState<number | null>(null)
  const lastSaved = useRef(startAt)

  useEffect(() => {
    const element = video.current
    if (!element || !lessonId) return

    const save = (seconds: number) => {
      const rounded = Math.max(0, Math.floor(seconds))
      if (Math.abs(rounded - lastSaved.current) < 3) return
      lastSaved.current = rounded
      void saveLessonPositionAction({ lessonId, seconds: rounded })
    }
    const onLoaded = () => {
      if (startAt >= MIN_RESUME && startAt < element.duration - END_MARGIN) {
        seek(startAt)
        setResumedFrom(startAt)
      }
    }
    const onTime = () => {
      if (!element.paused && Math.abs(element.currentTime - lastSaved.current) >= SAVE_EVERY_SECONDS) {
        save(element.currentTime)
      }
    }
    const onPause = () => save(element.currentTime)
    const onEnded = () => save(0)
    const onLeave = () => save(element.currentTime)

    if (element.readyState >= 1) onLoaded()
    element.addEventListener('loadedmetadata', onLoaded)
    element.addEventListener('timeupdate', onTime)
    element.addEventListener('pause', onPause)
    element.addEventListener('ended', onEnded)
    window.addEventListener('pagehide', onLeave)
    return () => {
      element.removeEventListener('loadedmetadata', onLoaded)
      element.removeEventListener('timeupdate', onTime)
      element.removeEventListener('pause', onPause)
      element.removeEventListener('ended', onEnded)
      window.removeEventListener('pagehide', onLeave)
      if (!element.ended) save(element.currentTime)
    }
  }, [video, seek, lessonId, startAt])

  const restart = () => {
    seek(0)
    setResumedFrom(null)
  }

  return { resumedFrom, restart, dismiss: () => setResumedFrom(null) }
}
