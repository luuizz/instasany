import 'server-only'
import type { SQL } from 'drizzle-orm'
import { db } from './client'

export type RawRow = Record<string, unknown>

// Consulta em SQL puro (relatórios com agregações); cada serviço converte as colunas na borda
export async function rawRows(query: SQL): Promise<RawRow[]> {
  return (await db().execute(query)).rows
}

export const num = (value: unknown) => Number(value ?? 0) || 0
export const str = (value: unknown) => (value == null ? '' : String(value))
export const date = (value: unknown) => (value == null ? null : new Date(String(value)))
