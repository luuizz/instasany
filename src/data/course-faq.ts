import type { FaqContent } from '@/types/home'

// Perguntas que valem para qualquer curso, mostradas no fim da página pública do curso
export const courseFaq: FaqContent = {
  eyebrow: 'Dúvidas',
  title: 'Antes de começar',
  items: [
    {
      question: 'O curso é mesmo gratuito?',
      answer:
        'Sim. A matrícula é grátis, sem cartão de crédito, e você tem acesso a todas as aulas, quizzes e ao certificado.',
    },
    {
      question: 'Preciso de experiência ou de muitos seguidores?',
      answer: 'Não. As aulas partem do zero e mostram o passo a passo, do perfil ao primeiro cliente.',
    },
    {
      question: 'Por quanto tempo tenho acesso?',
      answer:
        'O acesso não expira. Você estuda no seu ritmo, e o vídeo volta de onde parou quando você retoma uma aula.',
    },
    {
      question: 'Como funciona o certificado?',
      answer:
        'Conclua todas as aulas e passe nos quizzes dos módulos. O certificado sai na hora, tem um código de verificação e pode ser adicionado ao seu perfil do LinkedIn.',
    },
    {
      question: 'E se eu tiver uma dúvida durante a aula?',
      answer: 'Cada aula tem um espaço de dúvidas. Outros alunos e a equipe da Instasany respondem por lá.',
    },
  ],
}
