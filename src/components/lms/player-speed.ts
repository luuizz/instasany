// Velocidades do player; a escolhida fica no navegador e vale para todas as aulas
export const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2] as const
export type Speed = (typeof SPEEDS)[number]

const STORAGE_KEY = 'player-velocidade'

export function readSpeed(): Speed {
  try {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY))
    return SPEEDS.find((speed) => speed === saved) ?? 1
  } catch {
    return 1
  }
}

export function saveSpeed(speed: Speed) {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(speed))
  } catch {
    // Sem armazenamento (aba anônima restrita): a velocidade vale só para esta aula
  }
}

export const speedLabel = (speed: number) => `${String(speed).replace('.', ',')}x`
