import { EnrollButton } from './enroll-button'

type CourseCtaProps = { slug: string; title: string; enrolled: boolean }

// Faixa final da página do curso
export function CourseCta({ slug, title, enrolled }: CourseCtaProps) {
  return (
    <section className="relative overflow-hidden bg-pine py-16 lg:py-24">
      <div aria-hidden className="absolute inset-0 opacity-60 cover-art" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 text-center">
        <h2 className="text-3xl font-semibold text-balance text-paper sm:text-4xl">
          {enrolled ? 'Bora para a próxima aula?' : 'Pronto para começar?'}
        </h2>
        <p className="text-paper/70">
          {enrolled
            ? `Continue o ${title} de onde parou.`
            : `Matricule-se no ${title} agora. É grátis e leva menos de um minuto.`}
        </p>
        <EnrollButton slug={slug} enrolled={enrolled} />
      </div>
    </section>
  )
}
