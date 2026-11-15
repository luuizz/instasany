import type { Metadata } from 'next'
import Link from 'next/link'
import { ChangePasswordForm } from '@/components/account/change-password-form'
import { ProfileForm } from '@/components/account/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { requireUser } from '@/server/auth/session'

export const metadata: Metadata = { title: 'Meu perfil' }

export default async function ProfilePage() {
  const profile = await requireUser('/aluno/perfil')

  return (
    <Container className="flex flex-col gap-8 py-12 sm:py-16">
      <header>
        <Link href="/aluno" className="text-sm font-medium text-sage hover:underline">
          Área do aluno
        </Link>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Meu perfil</h1>
      </header>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Seus dados</CardTitle>
            <CardDescription>Como você aparece na Instasany.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm name={profile.name} email={profile.email} emailReminders={profile.emailReminders} />
          </CardContent>
        </Card>
        <Card className="rounded-3xl shadow-none">
          <CardHeader>
            <CardTitle className="text-lg">Senha</CardTitle>
            <CardDescription>Ao trocar, você continua conectado aqui e sai dos outros aparelhos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
