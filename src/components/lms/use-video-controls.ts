'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const SPEEDS = [1, 1.25, 1.5, 2] as const

// Estado do player (tempo, pausa, som, velocidade, tela cheia) a partir dos eventos do <video>
export function useVideoControls() {
  const video = useRef<HTMLVideoElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const element = video.current
    if (!element) return
    const sync = () => {
      setPlaying(!element.paused)
      setTime(element.currentTime)
      setDuration(Number.isFinite(element.duration) ? element.duration : 0)
      setMuted(element.muted)
    }
    const events = ['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange', 'volumechange', 'ended']
    events.forEach((name) => element.addEventListener(name, sync))
    const onFullscreen = () => setFullscreen(document.fullscreenElement === frame.current)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => {
      events.forEach((name) => element.removeEventListener(name, sync))
      document.removeEventListener('fullscreenchange', onFullscreen)
    }
  }, [])

  const toggle = useCallback(() => {
    const element = video.current
    if (!element) return
    if (element.paused) void element.play()
    else element.pause()
  }, [])

  const seek = useCallback((seconds: number) => {
    const element = video.current
    if (element) element.currentTime = Math.min(Math.max(seconds, 0), element.duration || 0)
  }, [])

  const toggleMute = useCallback(() => {
    if (video.current) video.current.muted = !video.current.muted
  }, [])

  const cycleSpeed = useCallback(() => {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length] ?? 1
    if (video.current) video.current.playbackRate = next
    setSpeed(next)
  }, [speed])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void frame.current?.requestFullscreen()
  }, [])

  // Atalhos quando o player está em foco: espaço/K pausa, setas pulam 5s, M tira o som, F tela cheia
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const actions: Record<string, () => void> = {
        ' ': toggle,
        k: toggle,
        ArrowRight: () => seek((video.current?.currentTime ?? 0) + 5),
        ArrowLeft: () => seek((video.current?.currentTime ?? 0) - 5),
        m: toggleMute,
        f: toggleFullscreen,
      }
      const action = actions[event.key]
      if (!action || (event.target as HTMLElement).tagName === 'INPUT') return
      event.preventDefault()
      action()
    },
    [seek, toggle, toggleFullscreen, toggleMute],
  )

  return {
    video,
    frame,
    playing,
    time,
    duration,
    muted,
    speed,
    fullscreen,
    toggle,
    seek,
    toggleMute,
    cycleSpeed,
    toggleFullscreen,
    onKeyDown,
  }
}
