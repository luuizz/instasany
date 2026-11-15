import 'server-only'
import { Resend } from 'resend'

export type EmailMessage = { to: string; subject: string; html: string; text: string }

export const isEmailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)

let client: Resend | undefined

// Envia pelo Resend; sem RESEND_API_KEY/EMAIL_FROM o envio é pulado (o site segue funcionando)
export async function sendEmail(message: EmailMessage) {
  if (!isEmailConfigured()) {
    console.info('[e-mail] envio desligado neste ambiente:', message.subject)
    return false
  }
  client ??= new Resend(process.env.RESEND_API_KEY)
  try {
    const { error } = await client.emails.send({ from: process.env.EMAIL_FROM as string, ...message })
    if (error) {
      console.error('[e-mail] o Resend recusou o envio:', error.name, error.message)
      return false
    }
    return true
  } catch (error) {
    console.error('[e-mail] falha ao enviar:', error)
    return false
  }
}
