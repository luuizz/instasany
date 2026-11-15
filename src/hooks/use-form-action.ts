'use client'

import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'

type Result = { ok: boolean } | null

// Server Action de formulário sem o reset automático do React 19: quando a action
// devolve erro, o que a pessoa digitou continua nos campos. Com successMessage,
// o sucesso aparece num toast.
export function useFormAction<State extends Result>(
  action: (state: Awaited<State>, formData: FormData) => Promise<State>,
  initial: Awaited<State>,
  successMessage?: string,
) {
  const [state, dispatch, pending] = useActionState<State, FormData>(action, initial)

  useEffect(() => {
    if (state?.ok && successMessage) toast.success(successMessage)
  }, [state, successMessage])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => dispatch(formData))
  }
  return { state, onSubmit, pending }
}
