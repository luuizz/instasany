'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { readSpeed, saveSpeed, SPEEDS, speedLabel, type Speed } from './player-speed'

export type Flash = { id: number; text: string }

// Estado do player (tempo, pausa, som, velocidade, tela cheia) a partir dos eventos do <video>
export function useVideoControls() {
  const video = useRef<HTMLVideoElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeedState] = useState<Speed>(1)
  const [fullscreen, setFullscreen] = useState(false)
  // Aviso rápido no meio do vídeo quando um atalho é usado ("+10s", "1,5x"...)
  const [flash, setFlash] = useState<Flash | null>(null)
  const show = useCallback((text: string) => setFlash({ id: Date.now(), text }), [])

  useEffect(() => {
    const element = video.current
    if (!element) return
    const saved = readSpeed()
    const applySpeed = () => {
      element.playbackRate = saved
    }
    setSpeedState(saved)
    applySpeed()
    const sync = () => {
      setPlaying(!element.paused)
      setTime(element.currentTime)
      setDuration(Number.isFinite(element.duration) ? element.duration : 0)
      setMuted(element.muted)
    }
    const events = ['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange', 'volumechange', 'ended']
    events.forEach((name) => element.addEventListener(name, sync))
    // Trocar o src volta a velocidade para 1x; reaplica a guardada
    element.addEventListener('loadedmetadata', applySpeed)
    const onFullscreen = () => setFullscreen(document.fullscreenElement === frame.current)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => {
      events.forEach((name) => element.removeEventListener(name, sync))
      element.removeEventListener('loadedmetadata', applySpeed)
      document.removeEventListener('fullscreenchange', onFullscreen)
    }
  }, [])

  useEffect(() => {
    if (!flash) return
    const timer = setTimeout(() => setFlash(null), 700)
    return () => clearTimeout(timer)
  }, [flash])

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

  const setSpeed = useCallback(
    (next: Speed) => {
      if (video.current) video.current.playbackRate = next
      setSpeedState(next)
      saveSpeed(next)
      show(speedLabel(next))
    },
    [show],
  )

  // step 0 avança em ciclo (botão); +1/-1 sobe ou desce sem dar a volta (atalhos)
  const changeSpeed = useCallback(
    (step: 0 | 1 | -1 = 0) => {
      const index = SPEEDS.indexOf(speed)
      const next =
        step === 0
          ? SPEEDS[(index + 1) % SPEEDS.length]
          : SPEEDS[Math.min(Math.max(index + step, 0), SPEEDS.length - 1)]
      setSpeed(next ?? 1)
    },
    [setSpeed, speed],
  )

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void frame.current?.requestFullscreen()
  }, [])

  return {
    video,
    frame,
    playing,
    time,
    duration,
    muted,
    speed,
    fullscreen,
    flash,
    show,
    toggle,
    seek,
    toggleMute,
    changeSpeed,
    toggleFullscreen,
  }
}
