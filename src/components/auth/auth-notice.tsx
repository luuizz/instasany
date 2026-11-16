import type { LucideIcon } from 'lucide-react'

type AuthNoticeProps = { icon: LucideIcon; title: string; children: React.ReactNode }

// Confirmação que substitui o formulário depois de enviado (conta criada, link enviado)
export function AuthNotice({ icon: Icon, title, children }: AuthNoticeProps) {
  return (
    <div
      role="status"
      className="flex animate-in flex-col items-center gap-4 text-center duration-300 zoom-in-95 fade-in"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-lime text-pine">
        <Icon className="size-7" />
      </span>
      <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      <div className="text-ink/65">{children}</div>
    </div>
  )
}
