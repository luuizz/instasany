import { z } from 'zod'

export const PASSWORD_MIN = 8

const email = z.string().trim().toLowerCase().email('Informe um e-mail válido.')

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha.'),
})

export const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(80, 'O nome pode ter até 80 caracteres.'),
  email,
  password: z.string().min(PASSWORD_MIN, `A senha precisa ter pelo menos ${PASSWORD_MIN} caracteres.`).max(128),
})

// Só caminhos internos, para não virar redirecionamento aberto
export function safeBack(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null
}
