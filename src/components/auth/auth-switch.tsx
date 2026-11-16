import Link from 'next/link'
import { cn } from '@/lib/utils'

type AuthSwitchProps = { current: 'sign-in' | 'sign-up'; back: string | null }

// Abas entre entrar e criar conta, mantendo a página para onde a pessoa volta depois
export function AuthSwitch({ current, back }: AuthSwitchProps) {
  const query = back ? `?volta=${encodeURIComponent(back)}` : ''
  const tabs = [
    { id: 'sign-in', href: `/entrar${query}`, label: 'Entrar' },
    { id: 'sign-up', href: `/cadastro${query}`, label: 'Criar conta' },
  ] as const
  return (
    <nav aria-label="Acesso" className="mb-8 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={tab.id === current ? 'page' : undefined}
          className={cn(
            'rounded-full py-2.5 text-center text-sm font-semibold transition',
            tab.id === current ? 'bg-paper text-pine shadow-sm' : 'text-ink/65 hover:text-pine',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
