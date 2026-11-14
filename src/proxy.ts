import { NextResponse, type NextRequest } from 'next/server'
import { getNeonAuth } from '@/server/auth/neon-auth'

// Áreas que exigem login. O papel (admin ou aluno) é conferido no layout de cada área.
export async function proxy(request: NextRequest) {
  const auth = getNeonAuth()
  if (!auth) return NextResponse.next()
  const back = `${request.nextUrl.pathname}${request.nextUrl.search}`
  return auth.middleware({ loginUrl: `/entrar?volta=${encodeURIComponent(back)}` })(request)
}

export const config = {
  matcher: ['/admin/:path*', '/aluno/:path*'],
}
