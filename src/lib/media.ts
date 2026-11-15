// Tipos e tamanhos aceitos no upload do painel (valem no navegador e na rota de upload)
export const MEDIA_RULES = {
  video: { accept: ['video/mp4', 'video/webm'], maxBytes: 200 * 1024 * 1024, folder: 'aulas' },
  image: { accept: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 5 * 1024 * 1024, folder: 'capas' },
} as const

export type MediaKind = keyof typeof MEDIA_RULES

export const isMediaKind = (value: unknown): value is MediaKind => value === 'video' || value === 'image'

export const formatBytes = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`
