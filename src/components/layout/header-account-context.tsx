'use client'

import { createContext, use, useEffect, useState } from 'react'
import { getHeaderAccountAction } from '@/app/(site)/actions'
import type { HeaderAccount } from '@/types/account'

// loading: ainda perguntando ao servidor; null: visitante sem login
type AccountState = HeaderAccount | null | 'loading'

const AccountContext = createContext<AccountState>(null)

export const useHeaderAccount = () => use(AccountContext)

// Uma consulta por montagem do cabeçalho, compartilhada pelo menu do desktop e do celular.
// Quando a página já sabe quem está logado (área do aluno), passa em `known` e nada é consultado.
export function HeaderAccountProvider({ known, children }: { known?: HeaderAccount; children: React.ReactNode }) {
  const [fetched, setFetched] = useState<AccountState>('loading')

  useEffect(() => {
    if (known) return
    let active = true
    getHeaderAccountAction()
      .then((account) => active && setFetched(account))
      .catch(() => active && setFetched(null))
    return () => {
      active = false
    }
  }, [known])

  return <AccountContext value={known ?? fetched}>{children}</AccountContext>
}
