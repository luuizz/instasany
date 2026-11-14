'use client'

import { startTransition, useActionState } from 'react'

// Server Action de formulário sem o reset automático do React 19: quando a action
// devolve erro, o que a pessoa digitou continua nos campos
export function useFormAction<State>(
  action: (state: Awaited<State>, formData: FormData) => Promise<State>,
  initial: Awaited<State>,
) {
  const [state, dispatch, pending] = useActionState<State, FormData>(action, initial)
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => dispatch(formData))
  }
  return { state, onSubmit, pending }
}
