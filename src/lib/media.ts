// Tipos e tamanhos aceitos no upload do painel (valem no navegador e na rota de upload)
export const MEDIA_RULES = {
  video: { accept: ['video/mp4', 'video/webm'], maxBytes: 200 * 1024 * 1024, folder: 'aulas' },
  image: { accept: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 5 * 1024 * 1024, folder: 'capas' },
} as const

export type MediaKind = keyof typeof MEDIA_RULES

export const isMediaKind = (value: unknown): value is MediaKind => value === 'video' || value === 'image'

export const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1).replace('.', ',')} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`

export const MEDIA_LABELS: Record<MediaKind, { the: string; sent: string; formats: string }> = {
  video: { the: 'o vídeo', sent: 'Vídeo enviado', formats: 'MP4 ou WebM' },
  image: { the: 'a imagem', sent: 'Imagem enviada', formats: 'JPG, PNG ou WebP' },
}

// Nome legível a partir do endereço no Blob ("aulas/abertura-x7Fq.mp4" -> "abertura-x7Fq.mp4")
export const fileNameFromUrl = (url: string) => {
  try {
    return decodeURIComponent(new URL(url).pathname.split('/').pop() ?? url)
  } catch {
    return url
  }
}

// Valida tipo e tamanho antes de enviar; devolve a mensagem de erro ou null
export function checkMediaFile(kind: MediaKind, file: { type: string; size: number }) {
  const rules = MEDIA_RULES[kind]
  if (!(rules.accept as readonly string[]).includes(file.type))
    return `Formato não aceito. Use ${MEDIA_LABELS[kind].formats}.`
  if (file.size > rules.maxBytes)
    return `O arquivo tem ${formatBytes(file.size)}; o limite é ${formatBytes(rules.maxBytes)}.`
  return null
}
