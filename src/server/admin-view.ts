import 'server-only'
import { cookies } from 'next/headers'
import { ADMIN_VIEW_COOKIE, parseAdminView } from '@/lib/admin-view'

export async function getAdminView() {
  return parseAdminView((await cookies()).get(ADMIN_VIEW_COOKIE)?.value)
}
