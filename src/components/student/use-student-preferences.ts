'use client'

import { useEffect, useState } from 'react'
import {
  MENU_COOKIE,
  savePreference,
  THEME_COOKIE,
  type StudentMenu,
  type StudentTheme,
} from '@/lib/student-preferences'

const darkQuery = '(prefers-color-scheme: dark)'

// Tema e menu da área do aluno: aplica .dark no <html> (para menus e janelas que abrem fora da moldura)
// enquanto a área do aluno está aberta, e tira ao sair dela
export function useStudentPreferences(initialTheme: StudentTheme, initialMenu: StudentMenu) {
  const [theme, setThemeState] = useState(initialTheme)
  const [menu, setMenuState] = useState(initialMenu)

  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia(darkQuery)
    const apply = () => root.classList.toggle('dark', theme === 'dark' || (theme === 'system' && media.matches))
    apply()
    if (theme === 'system') media.addEventListener('change', apply)
    return () => {
      media.removeEventListener('change', apply)
      root.classList.remove('dark')
    }
  }, [theme])

  const setTheme = (next: StudentTheme) => {
    setThemeState(next)
    savePreference(THEME_COOKIE, next)
  }
  const setMenu = (next: StudentMenu) => {
    setMenuState(next)
    savePreference(MENU_COOKIE, next)
  }
  return { theme, setTheme, menu, setMenu }
}
