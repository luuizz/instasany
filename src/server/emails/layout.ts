import 'server-only'
import { site } from '@/config/site'

// E-mail não lê o CSS do site: as cores de globals.css (pine, lime, ink) vão repetidas aqui
const COLORS = { pine: '#1d3531', lime: '#ccec60', paper: '#f4f6f5', ink: '#0f1f1c', muted: '#5f6f6b' }

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type EmailContent = {
  preheader: string
  title: string
  paragraphs: string[]
  cta?: { label: string; href: string }
  // Linha final menor (por que a pessoa recebeu o e-mail)
  note?: string
}

export const absoluteUrl = (path: string) => `${site.url}${path}`

// Layout único dos e-mails: tabela simples, texto alternativo e nada de imagens externas
export function renderEmail({ preheader, title, paragraphs, cta, note }: EmailContent) {
  const body = paragraphs
    .map((text) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${COLORS.ink}">${escape(text)}</p>`)
    .join('')
  const button = cta
    ? `<p style="margin:24px 0"><a href="${escape(cta.href)}" style="display:inline-block;background:${COLORS.lime};color:${COLORS.pine};font-weight:700;text-decoration:none;padding:14px 24px;border-radius:999px">${escape(cta.label)}</a></p>`
    : ''
  const footer = note
    ? `<p style="margin:24px 0 0;font-size:13px;line-height:1.5;color:${COLORS.muted}">${escape(note)}</p>`
    : ''

  const html = `<!doctype html><html lang="pt-BR"><body style="margin:0;background:${COLORS.paper};font-family:Arial,Helvetica,sans-serif">
<span style="display:none;max-height:0;overflow:hidden">${escape(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.paper};padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden">
<tr><td style="background:${COLORS.pine};padding:24px 32px;color:${COLORS.lime};font-size:20px;font-weight:700">${escape(site.name)}</td></tr>
<tr><td style="padding:32px">
<h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;color:${COLORS.ink}">${escape(title)}</h1>
${body}${button}${footer}
</td></tr></table>
<p style="margin:16px 0 0;font-size:12px;color:${COLORS.muted}">${escape(site.name)} · projeto fictício de estudo</p>
</td></tr></table></body></html>`

  const text = [
    title,
    '',
    ...paragraphs,
    ...(cta ? ['', `${cta.label}: ${cta.href}`] : []),
    ...(note ? ['', note] : []),
  ].join('\n')
  return { html, text }
}
