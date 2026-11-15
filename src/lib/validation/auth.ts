import { z } from 'zod'

export const PASSWORD_MIN = 8

const email = z.string().trim().toLowerCase().email('Informe um e-mail válido.')

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha.'),
})

const name = z.string().trim().min(2, 'Informe seu nome.').max(80, 'O nome pode ter até 80 caracteres.')
const newPassword = z
  .string()
  .min(PASSWORD_MIN, `A senha precisa ter pelo menos ${PASSWORD_MIN} caracteres.`)
  .max(128, 'A senha pode ter até 128 caracteres.')

export const signUpSchema = z.object({ name, email, password: newPassword })

export const forgotPasswordSchema = z.object({ email })

// Nova senha digitada duas vezes, para evitar erro de digitação
const samePassword = (data: { password: string; confirm: string }) => data.password === data.confirm
const mismatch = { message: 'As duas senhas não são iguais.', path: ['confirm'] }

export const resetPasswordSchema = z
  .object({ token: z.string().min(1, 'Link inválido. Peça um novo.'), password: newPassword, confirm: z.string() })
  .refine(samePassword, mismatch)

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Informe sua senha atual.'),
    password: newPassword,
    confirm: z.string(),
  })
  .refine(samePassword, mismatch)

export const profileSchema = z.object({ name })

// Só caminhos internos, para não virar redirecionamento aberto
export function safeBack(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null
}
