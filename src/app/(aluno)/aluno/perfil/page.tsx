import type { Metadata } from 'next'
import { ChangePasswordForm } from '@/components/account/change-password-form'
import { ProfileForm } from '@/components/account/profile-form'
import { StudentPageHeader } from '@/components/student/student-page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireUser } from '@/server/auth/session'

export const metadata: Metadata = { title: 'Meu perfil' }

export default async function ProfilePage() {
  const profile = await requireUser('/aluno/perfil')

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <StudentPageHeader
        eyebrow="Área do aluno"
        title="Meu perfil"
        description="Seus dados, os lembretes por e-mail e a sua senha."
      />
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
    </div>
  )
}
