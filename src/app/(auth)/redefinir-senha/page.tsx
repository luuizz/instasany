import type { Metadata } from 'next'
import { AuthHeading } from '@/components/auth/auth-heading'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { ButtonLink } from '@/components/ui/button'
import { FormMessage } from '@/components/ui/form-field'

export const metadata: Metadata = { title: 'Senha nova', robots: { index: false } }

type PageProps = { searchParams: Promise<{ token?: string; error?: string }> }

// O link do e-mail passa pelo Neon Auth e chega aqui com ?token= (ou ?error= se expirou)
export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token, error } = await searchParams

  if (!token || error) {
    return (
      <>
        <AuthHeading
          title="Link expirado"
          description="Os links de senha valem por 15 minutos e só podem ser usados uma vez."
        />
        <FormMessage>Este link não vale mais. Peça um novo para continuar.</FormMessage>
        <ButtonLink href="/esqueci-senha" size="lg" className="mt-6 w-full">
          Pedir um link novo
        </ButtonLink>
      </>
    )
  }

  return (
    <>
      <AuthHeading title="Crie uma senha nova" description="Depois de salvar, entre com o seu e-mail e a senha nova." />
      <ResetPasswordForm token={token} />
    </>
  )
}
