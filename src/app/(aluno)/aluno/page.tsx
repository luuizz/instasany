import Link from 'next/link'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { Container } from '@/components/ui/container'
import { requireUser } from '@/server/auth/session'

export default async function StudentHomePage() {
  const profile = await requireUser()
  const firstName = profile.name.split(' ')[0] || 'aluno'

  return (
    <Container className="py-12 sm:py-16">
      <p className="font-medium text-sage">Área do aluno</p>
      <h1 className="mt-2 text-4xl font-semibold text-ink">Olá, {firstName}!</h1>
      <div className="mt-8 rounded-3xl border border-dashed border-ink/15 p-8 text-ink/60">
        Seus cursos vão aparecer aqui assim que a plataforma de aulas estiver no ar.
      </div>
      <div className="mt-8 flex items-center gap-6 text-sm">
        {profile.role === 'admin' && (
          <Link href="/admin" className="font-semibold text-pine underline-offset-4 hover:underline">
            Ir para o painel
          </Link>
        )}
        <SignOutButton className="text-ink/60" />
      </div>
    </Container>
  )
}
