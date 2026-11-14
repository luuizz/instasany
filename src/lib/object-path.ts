// Leitura e escrita por caminho com pontos ("cards.1.alt"), usadas pelos formulários do CMS
export function getPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => (value as Record<string, unknown> | undefined)?.[key], source)
}

export function setPath<T>(source: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split('.')
  if (head === undefined) return source
  const container = (Array.isArray(source) ? [...source] : { ...(source as object) }) as Record<string, unknown>
  container[head] = rest.length ? setPath(container[head], rest.join('.'), value) : value
  return container as T
}
