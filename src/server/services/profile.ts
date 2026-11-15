import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { profiles } from '../db/schema'

export async function updateProfileName(profileId: string, name: string) {
  await db().update(profiles).set({ name, updatedAt: new Date() }).where(eq(profiles.id, profileId))
}
