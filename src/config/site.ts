export const site = {
  name: 'Instasany',
  description: 'Curso para criar, crescer e monetizar seu perfil no Instagram, de casa e no seu ritmo.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'pt_BR',
}

export const mainNav = [
  { href: '#inicio', label: 'Início' },
  { href: '#beneficios', label: 'Benefícios' },
  { href: '#para-quem', label: 'Para quem é o curso' },
  { href: '#precos', label: 'Preços promocionais' },
  { href: '#sobre', label: 'Sobre nós' },
] as const
