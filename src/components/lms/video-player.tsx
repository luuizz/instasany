'use client'

import {
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useVideoControls } from './use-video-controls'
import { useResumePosition } from './use-resume-position'
import { useWatchTracking } from './use-watch-tracking'

const clock = (seconds: number) => {
  const total = Math.floor(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

type PlayerButtonProps = { label: string; onClick: () => void; className?: string; children: React.ReactNode }

// Botão do player (Button do shadcn) com dica ao passar o mouse
function PlayerButton({ label, onClick, className, children }: PlayerButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClick}
          aria-label={label}
          className={cn(
            "text-paper hover:bg-paper/15 hover:text-paper [&_svg:not([class*='size-'])]:size-5",
            className,
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

// Player próprio, nas cores da marca, sobre o <video> nativo (sem marca de terceiros)
type VideoPlayerProps = { src: string; title: string; lessonId?: number; startAt?: number }

export function VideoPlayer({ src, title, lessonId, startAt = 0 }: VideoPlayerProps) {
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
  useWatchTracking(video, lessonId)
  const resume = useResumePosition(video, seek, lessonId, startAt)

  return (
    <div
      ref={frame}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label={`Vídeo: ${title}`}
      role="region"
      className="group relative aspect-video overflow-hidden rounded-3xl bg-night outline-none focus-visible:ring-4 focus-visible:ring-lime"
    >
      <video
        ref={video}
        src={src}
        preload="metadata"
        playsInline
        onClick={toggle}
        className="size-full cursor-pointer"
      />

      {resume.resumedFrom !== null && (
        <div
          role="status"
          className="absolute top-4 left-4 flex animate-in items-center gap-1 rounded-full bg-night/80 py-1 pr-1 pl-4 text-sm text-paper backdrop-blur fade-in slide-in-from-top-2"
        >
          Continuando de {clock(resume.resumedFrom)}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resume.restart}
            className="h-8 text-lime hover:bg-paper/15 hover:text-lime"
          >
            <RotateCcwIcon />
            Do início
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={resume.dismiss}
            aria-label="Fechar aviso"
            className="size-8 text-paper/70 hover:bg-paper/15 hover:text-paper"
          >
            <XIcon />
          </Button>
        </div>
      )}

      {!playing && (
        <Button
          type="button"
          onClick={toggle}
          aria-label="Reproduzir"
          className="absolute top-1/2 left-1/2 size-20 -translate-1/2 shadow-xl hover:scale-105 [&_svg:not([class*='size-'])]:size-9"
        >
          <PlayIcon className="ml-1" />
        </Button>
      )}

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-night/90 to-transparent px-4 pt-10 pb-3 transition-opacity duration-300',
          playing && 'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100',
        )}
      >
        <Slider
          min={0}
          max={duration || 1}
          step={0.1}
          value={[time]}
          onValueChange={([value]) => seek(value ?? 0)}
          aria-label="Posição do vídeo"
          aria-valuetext={`${clock(time)} de ${clock(duration)}`}
          className="cursor-pointer [&_[data-slot=slider-range]]:bg-lime [&_[data-slot=slider-thumb]]:border-lime [&_[data-slot=slider-track]]:bg-paper/25"
        />
        <div className="flex items-center gap-1 text-sm text-paper">
          <PlayerButton label={playing ? 'Pausar' : 'Reproduzir'} onClick={toggle}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </PlayerButton>
          <PlayerButton label={muted ? 'Ativar som' : 'Tirar som'} onClick={toggleMute}>
            {muted ? <VolumeXIcon /> : <Volume2Icon />}
          </PlayerButton>
          <span className="ml-2 tabular-nums">
            {clock(time)} / {clock(duration)}
          </span>
          <PlayerButton
            label={`Velocidade ${speed}x`}
            onClick={cycleSpeed}
            className="ml-auto w-auto px-3 font-semibold"
          >
            {speed}x
          </PlayerButton>
          <PlayerButton label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} onClick={toggleFullscreen}>
            {fullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </PlayerButton>
        </div>
      </div>
    </div>
  )
}
