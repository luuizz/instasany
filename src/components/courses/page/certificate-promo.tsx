import { AwardIcon, BadgeCheckIcon } from 'lucide-react'
import { site } from '@/config/site'

// Prévia do certificado: o que a pessoa ganha ao terminar o curso
export function CertificatePromo({ courseTitle }: { courseTitle: string }) {
  return (
    <section
      aria-labelledby="certificado"
      className="relative overflow-hidden rounded-3xl bg-pine p-6 text-paper sm:p-10"
    >
      <div aria-hidden className="absolute inset-0 opacity-60 cover-art" />
      <div className="relative grid items-center gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-lime text-pine">
            <AwardIcon className="size-6" />
          </span>
          <h2 id="certificado" className="text-3xl font-semibold text-balance">
            Termine e ganhe seu certificado
          </h2>
          <p className="text-paper/70">
            Conclua as aulas e os quizzes. O certificado sai na hora, com um código que qualquer pessoa pode conferir, e
            vai para o seu perfil do LinkedIn em um clique.
          </p>
        </div>
        <div aria-hidden className="rotate-2 rounded-2xl bg-paper p-5 text-ink shadow-2xl shadow-ink/50">
          <div className="rounded-xl p-5 ring-1 ring-pine/15">
            <p className="text-xs font-semibold tracking-widest text-sage uppercase">Certificado de conclusão</p>
            <p className="mt-3 text-sm text-ink/60">Certificamos que</p>
            <p className="text-2xl font-semibold">Seu nome aqui</p>
            <p className="mt-2 text-sm text-ink/60">concluiu o curso</p>
            <p className="font-semibold text-pine">{courseTitle}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-ink/50">
              <span>{site.name}</span>
              <span className="flex items-center gap-1 text-sage">
                <BadgeCheckIcon className="size-4" />
                Verificado
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
