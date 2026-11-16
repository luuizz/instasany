import { AwardIcon, BookOpenIcon, CompassIcon, HomeIcon, UserRoundIcon } from 'lucide-react'

// Menu da área do aluno; exact: só a própria rota acende o item
export const studentNav = [
  { href: '/aluno', label: 'Início', icon: HomeIcon, exact: true },
  { href: '/aluno/cursos', label: 'Meus cursos', icon: BookOpenIcon },
  { href: '/aluno/certificados', label: 'Certificados', icon: AwardIcon },
  { href: '/aluno/perfil', label: 'Meu perfil', icon: UserRoundIcon },
]

export const exploreLink = { href: '/aluno/explorar', label: 'Explorar cursos', icon: CompassIcon }

export function isActiveRoute(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

// Na aula e no quiz o menu lateral encolhe para só os ícones
export function isFocusRoute(pathname: string) {
  return /^\/aluno\/cursos\/[^/]+\/(aulas|quiz)\//.test(pathname)
}
