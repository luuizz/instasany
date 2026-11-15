import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthHeading } from '@/components/auth/auth-heading'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { redirectIfSignedIn } from '@/server/auth/redirect-if-signed-in'

export const metadata: Metadata = { title: 'Esqueci a senha', robots: { index: false } }

export default async function ForgotPasswordPage() {
  await redirectIfSignedIn(null)
  return (
    <>
      <AuthHeading
        title="Esqueci a senha"
        description="Informe o e-mail da sua conta e enviaremos um link para criar uma senha nova."
      />
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-ink/60">
        Lembrou?{' '}
        <Link href="/entrar" className="font-semibold text-pine underline-offset-4 hover:underline">
          Voltar para o login
        </Link>
      </p>
    </>
  )
}
