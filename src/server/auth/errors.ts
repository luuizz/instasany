import 'server-only'

type AuthErrorLike = { code?: string; message?: string; status?: number } | null | undefined

// O Neon Auth devolve tanto os códigos do Better Auth quanto os do formato Supabase
const byCode: Record<string, string> = {
  invalid_credentials: 'E-mail ou senha incorretos.',
  user_already_exists: 'Já existe uma conta com este e-mail.',
  email_exists: 'Já existe uma conta com este e-mail.',
  email_not_confirmed: 'Confirme seu e-mail antes de entrar. Veja sua caixa de entrada.',
  weak_password: 'A senha é curta demais.',
  over_request_rate_limit: 'Muitas tentativas. Aguarde um pouco e tente de novo.',
  INVALID_EMAIL_OR_PASSWORD: 'E-mail ou senha incorretos.',
  USER_ALREADY_EXISTS: 'Já existe uma conta com este e-mail.',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Já existe uma conta com este e-mail.',
  PASSWORD_TOO_SHORT: 'A senha é curta demais.',
  EMAIL_NOT_VERIFIED: 'Confirme seu e-mail antes de entrar. Veja sua caixa de entrada.',
  INVALID_TOKEN: 'Este link expirou ou já foi usado. Peça um novo.',
  INVALID_PASSWORD: 'A senha atual está incorreta.',
  CREDENTIAL_ACCOUNT_NOT_FOUND: 'Esta conta não usa senha.',
  INVALID_ORIGIN: 'Este endereço não está autorizado no Neon Auth (domínios confiáveis).',
}

// Converte o erro do Neon Auth (Better Auth) numa mensagem para o usuário
export function authErrorMessage(error: AuthErrorLike, fallback: string) {
  if (error?.code && byCode[error.code]) return byCode[error.code] as string
  if (error?.message?.startsWith('User already exists')) return 'Já existe uma conta com este e-mail.'
  if (error?.status === 429) return 'Muitas tentativas. Aguarde um pouco e tente de novo.'
  if (error) console.error('[auth]', error.code, error.message)
  return fallback
}
