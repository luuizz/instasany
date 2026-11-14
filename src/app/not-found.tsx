import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-pine px-6 text-center">
      <p className="font-medium text-sage">Erro 404</p>
      <h1 className="text-4xl font-semibold text-paper sm:text-5xl">Página não encontrada</h1>
      <ButtonLink href="/">Voltar para o início</ButtonLink>
    </main>
  )
}
