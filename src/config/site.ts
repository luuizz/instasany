export const site = {
  name: 'Instasany',
  description: 'Curso para criar, crescer e monetizar seu perfil no Instagram, de casa e no seu ritmo.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'pt_BR',
}

// "Cursos" é uma página; os demais são seções da home (âncoras)
export const mainNav = [
  { href: '/cursos', label: 'Cursos' },
  { href: '/#beneficios', label: 'Benefícios' },
  { href: '/#para-quem', label: 'Para quem é' },
  { href: '/#precos', label: 'Preços' },
  { href: '/#sobre', label: 'Sobre nós' },
] as const
