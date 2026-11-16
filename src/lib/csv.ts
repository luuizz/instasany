// Planilha em CSV para abrir direto no Excel em português: ponto e vírgula, BOM e datas legíveis

type Cell = string | number | Date | null | undefined

const dateTime = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})

function cell(value: Cell) {
  if (value === null || value === undefined) return ''
  const text = value instanceof Date ? dateTime.format(value) : String(value)
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function toCsv<T>(rows: T[], columns: { header: string; value: (row: T) => Cell }[]) {
  const lines = [columns.map((column) => cell(column.header)).join(';')]
  for (const row of rows) lines.push(columns.map((column) => cell(column.value(row))).join(';'))
  return `﻿${lines.join('\r\n')}\r\n`
}

export function csvResponse(csv: string, filename: string) {
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
