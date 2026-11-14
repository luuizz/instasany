import { getNeonAuth } from '@/server/auth/neon-auth'

type Context = { params: Promise<{ path: string[] }> }

// Endpoints do Neon Auth no domínio do site (sessão, links de e-mail)
async function handle(request: Request, context: Context) {
  const auth = getNeonAuth()
  if (!auth) return Response.json({ error: 'Login indisponível neste ambiente.' }, { status: 503 })
  const handlers = auth.handler()
  const handler = handlers[request.method as keyof typeof handlers]
  return handler ? handler(request, context) : new Response(null, { status: 405 })
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE }
