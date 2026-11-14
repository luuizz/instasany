'use client'

import { ExpandIcon, PauseIcon, PlayIcon, VolumeIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { useVideoControls } from './use-video-controls'

const clock = (seconds: number) => {
  const total = Math.floor(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

const control = 'flex size-9 cursor-pointer items-center justify-center rounded-full text-paper hover:bg-paper/15'

// Player próprio, nas cores da marca, sobre o <video> nativo (sem marca de terceiros)
export function VideoPlayer({ src, title }: { src: string; title: string }) {
  const {
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
  } = useVideoControls()

  return (
    <div
      ref={frame}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`Vídeo: ${title}`}
      role="region"
      className="group relative aspect-video overflow-hidden rounded-3xl bg-ink outline-none focus-visible:ring-4 focus-visible:ring-lime"
    >
      <video
        ref={video}
        src={src}
        preload="metadata"
        playsInline
        onClick={toggle}
        className="size-full cursor-pointer"
      />

      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Reproduzir"
          className="absolute top-1/2 left-1/2 flex size-20 -translate-1/2 cursor-pointer items-center justify-center rounded-full bg-lime text-pine shadow-xl transition hover:scale-105"
        >
          <PlayIcon className="ml-1 size-9" />
        </button>
      )}

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-ink/90 to-transparent px-4 pt-10 pb-3 transition-opacity',
          playing && 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100',
        )}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Posição do vídeo"
          aria-valuetext={`${clock(time)} de ${clock(duration)}`}
          className="h-1.5 w-full cursor-pointer accent-lime"
        />
        <div className="flex items-center gap-1 text-sm text-paper">
          <button type="button" onClick={toggle} className={control} aria-label={playing ? 'Pausar' : 'Reproduzir'}>
            {playing ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className={control}
            aria-label={muted ? 'Ativar som' : 'Tirar som'}
          >
            <VolumeIcon muted={muted} className="size-5" />
          </button>
          <span className="ml-2 tabular-nums">
            {clock(time)} / {clock(duration)}
          </span>
          <button
            type="button"
            onClick={cycleSpeed}
            className="ml-auto cursor-pointer rounded-full px-3 py-1 font-semibold hover:bg-paper/15"
            aria-label={`Velocidade ${speed}x`}
          >
            {speed}x
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className={control}
            aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            <ExpandIcon exit={fullscreen} className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
