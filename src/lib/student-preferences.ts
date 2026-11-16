// Preferências da área do aluno guardadas em cookie, lidas no servidor para a página já chegar certa
export const THEME_COOKIE = 'aluno-tema'
export const MENU_COOKIE = 'aluno-menu'

export const STUDENT_THEMES = ['light', 'dark', 'system'] as const
export type StudentTheme = (typeof STUDENT_THEMES)[number]
// auto: menu aberto, mas só com ícones na aula e no quiz
export type StudentMenu = 'auto' | 'open' | 'collapsed'

export function parseTheme(value: string | undefined): StudentTheme {
  return STUDENT_THEMES.find((theme) => theme === value) ?? 'light'
}

export function parseMenu(value: string | undefined): StudentMenu {
  return value === 'open' || value === 'collapsed' ? value : 'auto'
}

export function savePreference(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`
}

// Roda antes da primeira pintura quando o tema é escuro ou automático, para não piscar claro
export function themeScript(theme: StudentTheme) {
  if (theme === 'light') return null
  const dark = theme === 'dark' ? 'true' : "matchMedia('(prefers-color-scheme: dark)').matches"
  return `if(${dark})document.documentElement.classList.add('dark')`
}
