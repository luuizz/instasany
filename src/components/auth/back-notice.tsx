import { LockKeyholeIcon } from 'lucide-react'

// Aviso quando a pessoa chegou aqui vindo de uma página que pede login
export function BackNotice({ back }: { back: string | null }) {
  if (!back) return null
  const enrolling = back.startsWith('/cursos/')
  return (
    <p className="mb-6 flex items-start gap-3 rounded-2xl bg-secondary p-4 text-sm text-pine">
      <LockKeyholeIcon className="mt-0.5 size-4 shrink-0" />
      {enrolling
        ? 'Entre ou crie sua conta para se matricular. Depois você volta direto para o curso.'
        : 'Essa página pede login. Depois de entrar você volta direto para ela.'}
    </p>
  )
}
