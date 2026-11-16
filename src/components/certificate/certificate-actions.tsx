import { BadgeCheckIcon, Share2Icon } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button'
import { linkedInAddToProfileUrl, linkedInShareUrl } from '@/lib/linkedin'
import type { Certificate } from '@/types/lms'
import { CopyLinkButton } from './copy-link-button'
import { LinkedInIcon } from './linkedin-icon'
import { PrintButton } from './print-button'

type CertificateActionsProps = { certificate: Certificate; url: string; isOwner: boolean }

// Dono: adicionar ao LinkedIn, compartilhar, copiar e imprimir. Quem só confere vê o selo de verificado.
export function CertificateActions({ certificate, url, isOwner }: CertificateActionsProps) {
  if (!isOwner) {
    return (
      <p className="flex items-center gap-2 rounded-full bg-lime/30 px-4 py-2 text-sm font-semibold text-pine">
        <BadgeCheckIcon className="size-5" />
        Certificado verificado pela Instasany
      </p>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ButtonLink
        href={linkedInAddToProfileUrl({ ...certificate, url })}
        target="_blank"
        rel="noreferrer"
        variant="dark"
        size="default"
      >
        <LinkedInIcon className="size-4" />
        Adicionar ao perfil
      </ButtonLink>
      <ButtonLink href={linkedInShareUrl(url)} target="_blank" rel="noreferrer" variant="outline" size="default">
        <Share2Icon />
        Compartilhar
      </ButtonLink>
      <CopyLinkButton url={url} />
      <PrintButton />
    </div>
  )
}
