import { BadgeCheckIcon } from 'lucide-react'
import { LinkedInIcon } from '@/components/certificate/linkedin-icon'

// Prévia ilustrativa do certificado com o atalho para o LinkedIn
export function MockCertificate() {
  return (
    <div className="flex flex-col gap-3">
      <div data-anim="certificate" className="rounded-2xl bg-paper p-4 text-ink shadow-xl shadow-ink/30">
        <div className="rounded-xl p-4 ring-1 ring-pine/15">
          <p className="text-2xs font-semibold tracking-widest text-sage uppercase">Certificado de conclusão</p>
          <p className="mt-2 text-lg font-semibold">Marina Costa</p>
          <p className="text-xs text-ink/65">Instagram do zero ao primeiro cliente</p>
          <p data-anim="stamp" className="mt-3 flex items-center gap-1 text-xs font-semibold text-sage">
            <BadgeCheckIcon className="size-4" />
            Verificado
          </p>
        </div>
      </div>
      <span
        data-anim="linkedin"
        className="relative flex items-center justify-center gap-2 self-start overflow-hidden rounded-full bg-paper px-4 py-2 text-xs font-semibold text-pine"
      >
        <LinkedInIcon className="size-4" />
        Adicionar ao perfil
        <span data-anim="shine" className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-lime/50" />
      </span>
    </div>
  )
}
