import type { Metadata } from 'next'
import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthHeading } from '@/components/auth/auth-heading'
import { safeBack } from '@/lib/validation/auth'
import { redirectIfSignedIn } from '@/server/auth/redirect-if-signed-in'
import { signUp } from '../actions'

export const metadata: Metadata = { title: 'Criar conta', robots: { index: false } }

type PageProps = { searchParams: Promise<{ volta?: string }> }

export default async function SignUpPage({ searchParams }: PageProps) {
  const back = safeBack((await searchParams).volta)
  await redirectIfSignedIn(back)
  const signInHref = back ? `/entrar?volta=${encodeURIComponent(back)}` : '/entrar'

  return (
    <>
      <AuthHeading title="Criar conta" description="Leva menos de um minuto e é grátis." />
      <AuthForm mode="sign-up" action={signUp} back={back} />
      <p className="mt-6 text-center text-sm text-ink/60">
        Já tem conta?{' '}
        <Link href={signInHref} className="font-semibold text-pine underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </>
  )
}
