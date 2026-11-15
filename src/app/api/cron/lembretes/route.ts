import { sendInactivityReminders } from '@/server/services/notifications'

// Chamado uma vez por dia pelo Cron da Vercel (vercel.json), que envia o CRON_SECRET no cabeçalho
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return Response.json({ error: 'CRON_SECRET não configurado.' }, { status: 503 })
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const result = await sendInactivityReminders()
  return Response.json(result)
}
