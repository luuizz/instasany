import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthHeading } from '@/components/auth/auth-heading'
import { FormMessage } from '@/components/ui/form-field'
import { safeBack } from '@/lib/validation/auth'
import { redirectIfSignedIn } from '@/server/auth/redirect-if-signed-in'
import { signIn } from '../actions'

export const metadata: Metadata = { title: 'Entrar', robots: { index: false } }

type PageProps = { searchParams: Promise<{ volta?: string; senha?: string }> }

export default async function SignInPage({ searchParams }: PageProps) {
  const params = await searchParams
  const back = safeBack(params.volta)
  await redirectIfSignedIn(back)
  const signUpHref = back ? `/cadastro?volta=${encodeURIComponent(back)}` : '/cadastro'

  return (
    <>
      <AuthHeading title="Entrar" description="Acesse seus cursos e continue de onde parou." />
      {params.senha === 'nova' && (
        <div className="mb-5">
          <FormMessage tone="success">Senha nova salva. Entre com ela.</FormMessage>
        </div>
      )}
      <AuthForm mode="sign-in" action={signIn} back={back} />
      <p className="mt-4 text-right text-sm">
        <Link href="/esqueci-senha" className="font-medium text-pine underline-offset-4 hover:underline">
          Esqueci a senha
        </Link>
      </p>
      <p className="mt-6 text-center text-sm text-ink/60">
        Ainda não tem conta?{' '}
        <Link href={signUpHref} className="font-semibold text-pine underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  )
}
