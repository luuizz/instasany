import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthHeading } from '@/components/auth/auth-heading'
import { AuthSwitch } from '@/components/auth/auth-switch'
import { BackNotice } from '@/components/auth/back-notice'
import { safeBack } from '@/lib/validation/auth'
import { redirectIfSignedIn } from '@/server/auth/redirect-if-signed-in'
import { signUp } from '../actions'

export const metadata: Metadata = { title: 'Criar conta', robots: { index: false } }

type PageProps = { searchParams: Promise<{ volta?: string }> }

export default async function SignUpPage({ searchParams }: PageProps) {
  const back = safeBack((await searchParams).volta)
  await redirectIfSignedIn(back)

  return (
    <>
      <AuthSwitch current="sign-up" back={back} />
      <AuthHeading title="Comece a estudar hoje" description="Crie sua conta em menos de um minuto. É grátis." />
      <BackNotice back={back} />
      <AuthForm mode="sign-up" action={signUp} back={back} />
    </>
  )
}
