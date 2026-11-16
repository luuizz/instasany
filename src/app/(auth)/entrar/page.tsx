import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthHeading } from '@/components/auth/auth-heading'
import { AuthSwitch } from '@/components/auth/auth-switch'
import { BackNotice } from '@/components/auth/back-notice'
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

  return (
    <>
      <AuthSwitch current="sign-in" back={back} />
      <AuthHeading title="Que bom te ver de novo" description="Entre para continuar seus cursos de onde parou." />
      <BackNotice back={back} />
      {params.senha === 'nova' && (
        <div className="mb-5">
          <FormMessage tone="success">Senha nova salva. Entre com ela.</FormMessage>
        </div>
      )}
      <AuthForm mode="sign-in" action={signIn} back={back} />
    </>
  )
}
