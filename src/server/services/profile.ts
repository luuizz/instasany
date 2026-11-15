import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from '../db/client'
import { profiles } from '../db/schema'

export async function updateProfile(profileId: string, changes: { name: string; emailReminders: boolean }) {
  await db()
    .update(profiles)
    .set({ ...changes, updatedAt: new Date() })
    .where(eq(profiles.id, profileId))
}
