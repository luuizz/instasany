import 'server-only'
import { absoluteUrl, renderEmail } from './layout'

const profileNote = 'Você pode desligar os lembretes na página Meu perfil, na área do aluno.'

export function welcomeEmail(firstName: string) {
  return {
    subject: 'Boas-vindas à Instasany',
    ...renderEmail({
      preheader: 'Sua conta está pronta. Escolha um curso para começar.',
      title: `Que bom ter você aqui, ${firstName}!`,
      paragraphs: [
        'Sua conta na Instasany está pronta. Os cursos são gratuitos e você estuda no seu ritmo: cada aula é curta e pensada para aplicar no mesmo dia.',
        'Escolha um curso, se matricule e comece pela primeira aula.',
      ],
      cta: { label: 'Ver os cursos', href: absoluteUrl('/cursos') },
    }),
  }
}

export function enrollmentEmail(firstName: string, courseTitle: string, startPath: string) {
  return {
    subject: `Matrícula confirmada: ${courseTitle}`,
    ...renderEmail({
      preheader: `Você já pode começar ${courseTitle}.`,
      title: `Você está em ${courseTitle}`,
      paragraphs: [
        `${firstName}, sua matrícula foi confirmada.`,
        'Assista uma aula, aplique no seu perfil e marque como concluída. Ao final de cada módulo há um quiz curto, e quem conclui tudo recebe o certificado.',
      ],
      cta: { label: 'Começar o curso', href: absoluteUrl(startPath) },
    }),
  }
}

type AnswerEmail = { firstName: string; replierName: string; lessonTitle: string; excerpt: string; path: string }

export function answerEmail({ firstName, replierName, lessonTitle, excerpt, path }: AnswerEmail) {
  return {
    subject: `Sua dúvida em "${lessonTitle}" foi respondida`,
    ...renderEmail({
      preheader: `${replierName} respondeu: ${excerpt}`,
      title: 'Sua dúvida tem resposta',
      paragraphs: [`${firstName}, ${replierName} respondeu à sua dúvida na aula "${lessonTitle}":`, `“${excerpt}”`],
      cta: { label: 'Ver a conversa', href: absoluteUrl(path) },
    }),
  }
}

type ReminderEmail = { firstName: string; courseTitle: string; done: number; total: number; path: string }

export function reminderEmail({ firstName, courseTitle, done, total, path }: ReminderEmail) {
  const percent = total ? Math.round((done / total) * 100) : 0
  return {
    subject: `Sua próxima aula de ${courseTitle} está esperando`,
    ...renderEmail({
      preheader: `Você já fez ${percent}% do curso. Que tal mais uma aula hoje?`,
      title: `Bora continuar, ${firstName}?`,
      paragraphs: [
        `Faz uma semana que você não abre ${courseTitle}. Você já concluiu ${done} de ${total} aulas (${percent}%).`,
        'Uma aula leva poucos minutos e o player volta exatamente de onde você parou.',
      ],
      cta: { label: 'Continuar de onde parei', href: absoluteUrl(path) },
      note: profileNote,
    }),
  }
}
