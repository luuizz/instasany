import 'server-only'
import { createNeonAuth, type NeonAuth } from '@neon/auth/next/server'

let instance: NeonAuth | null | undefined

// Neon Auth no servidor: login, cadastro e sessão passam pelo domínio do site e a sessão
// fica num cookie assinado. Sem as variáveis o site sobe e só o login fica indisponível.
export function getNeonAuth(): NeonAuth | null {
  if (instance !== undefined) return instance
  const baseUrl = process.env.NEON_AUTH_BASE_URL ?? ''
  const secret = process.env.NEON_AUTH_COOKIE_SECRET ?? ''
  instance = baseUrl && secret.length >= 32 ? createNeonAuth({ baseUrl, cookies: { secret } }) : null
  return instance
}
