import type { Metadata } from 'next'
import { Container } from '@/components/ui/container'

export const metadata: Metadata = {
  title: 'Privacidade',
  description: 'O que a Instasany registra sobre o uso do site e das aulas.',
}

const sections = [
  {
    title: 'O que registramos',
    text: 'Páginas abertas, quando você dá play numa aula, quanto tempo de vídeo assistiu, matrículas e aulas concluídas. Usamos isso para entender o que funciona nos cursos e melhorar as aulas.',
  },
  {
    title: 'Como identificamos o navegador',
    text: 'Um número aleatório fica guardado no seu navegador para contar visitantes únicos. Ele não tem relação com seu nome, e não guardamos seu IP nem dados do aparelho. Se você estiver logado, a atividade fica ligada à sua conta para mostrar seu progresso.',
  },
  {
    title: 'Sem terceiros',
    text: 'Os dados ficam no banco da própria plataforma. Não usamos Google Analytics, pixels de anúncio nem cookies de terceiros.',
  },
  {
    title: 'E-mails',
    text: 'Enviamos e-mails só sobre a sua conta e os seus cursos: boas-vindas, confirmação de matrícula, aviso quando sua dúvida é respondida e um lembrete se você passar uma semana sem abrir um curso que começou. O lembrete pode ser desligado em Meu perfil.',
  },
  {
    title: 'Como não ser contado',
    text: 'Se o seu navegador estiver com "não rastrear" (Do Not Track) ou Global Privacy Control ligados, nada é registrado sobre a navegação. Apagar os dados do site no navegador também gera um novo número aleatório.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <section className="border-t border-pine-line bg-pine bg-hero bg-top bg-no-repeat py-16 lg:py-24">
        <Container className="text-center">
          <p className="font-medium text-sage sm:text-lg">Privacidade</p>
          <h1 className="mt-4 text-4xl/tight font-semibold text-balance text-paper sm:text-6xl/tight">
            O que medimos e por quê
          </h1>
        </Container>
      </section>
      <Container className="max-w-3xl py-16 lg:py-24">
        <div className="flex flex-col gap-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-ink">{section.title}</h2>
              <p className="mt-3 text-lg text-ink/70">{section.text}</p>
            </section>
          ))}
          <p className="text-sm text-ink/50">A Instasany é um projeto fictício de estudo.</p>
        </div>
      </Container>
    </>
  )
}
