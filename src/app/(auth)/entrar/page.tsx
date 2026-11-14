import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthHeading } from '@/components/auth/auth-heading'
import { safeBack } from '@/lib/validation/auth'
import { redirectIfSignedIn } from '@/server/auth/redirect-if-signed-in'
import { signIn } from '../actions'

export const metadata: Metadata = { title: 'Entrar', robots: { index: false } }

type PageProps = { searchParams: Promise<{ volta?: string }> }

export default async function SignInPage({ searchParams }: PageProps) {
  const back = safeBack((await searchParams).volta)
  await redirectIfSignedIn(back)
  const signUpHref = back ? `/cadastro?volta=${encodeURIComponent(back)}` : '/cadastro'

  return (
    <>
      <AuthHeading title="Entrar" description="Acesse seus cursos e continue de onde parou." />
      <AuthForm mode="sign-in" action={signIn} back={back} />
      <p className="mt-6 text-center text-sm text-ink/60">
        Ainda não tem conta?{' '}
        <Link href={signUpHref} className="font-semibold text-pine underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  )
}
