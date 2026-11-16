'use client'

import { CheckIcon, LinkIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link do certificado copiado.')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Não foi possível copiar. Copie o endereço pela barra do navegador.')
    }
  }
  return (
    <Button type="button" variant="outline" size="default" onClick={copy}>
      {copied ? <CheckIcon /> : <LinkIcon />}
      {copied ? 'Copiado' : 'Copiar link'}
    </Button>
  )
}
