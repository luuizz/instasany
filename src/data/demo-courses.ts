import type { CourseLevel } from '@/types/lms'

type DemoLesson = { title: string; minutes: number; content: string }
type DemoCourse = {
  slug: string
  title: string
  summary: string
  description: string
  level: CourseLevel
  modules: { title: string; lessons: DemoLesson[] }[]
}

// Cursos fictícios para popular o LMS pelo painel ("Criar cursos de exemplo")
export const demoCourses: DemoCourse[] = [
  {
    slug: 'instagram-do-zero',
    title: 'Instagram do zero ao primeiro cliente',
    summary: 'Posicionamento, conteúdo e venda pelo direct para quem está começando.',
    description:
      'Um caminho em três etapas para sair de um perfil parado até a primeira venda. Você define para quem fala, aprende a produzir com constância e conduz conversas que viram clientes.',
    level: 'Iniciante',
    modules: [
      {
        title: 'Posicionamento',
        lessons: [
          {
            title: 'Boas-vindas e como estudar',
            minutes: 5,
            content:
              'Este curso foi pensado para ser feito em pequenas doses. Assista uma aula, aplique no seu perfil no mesmo dia e só depois siga para a próxima.\n\nAo final de cada módulo você terá uma tarefa prática. Marque a aula como concluída para acompanhar seu progresso.',
          },
          {
            title: 'Definindo seu nicho',
            minutes: 12,
            content:
              'Nicho não é uma prisão, é um ponto de partida. Escolha um público que você entende e um problema que sabe resolver.\n\nExercício: escreva em uma frase quem você ajuda, com o quê e qual o resultado. Exemplo: "Ajudo confeiteiras de casa a venderem encomendas pelo Instagram".',
          },
          {
            title: 'Bio que converte',
            minutes: 10,
            content:
              'A bio responde três perguntas em poucos segundos: quem é você, o que você faz por quem chega e qual o próximo passo.\n\nUse a primeira linha para o benefício, a segunda para a prova e a terceira para a chamada com o link.',
          },
        ],
      },
      {
        title: 'Conteúdo',
        lessons: [
          {
            title: 'Os 3 tipos de post que trazem seguidores',
            minutes: 14,
            content:
              'Conteúdo que ensina, conteúdo que conecta e conteúdo que vende. Um perfil saudável alterna os três ao longo da semana.\n\nMonte um calendário simples: dois posts que ensinam, um que conecta e um que vende.',
          },
          {
            title: 'Roteiro de Reels em 5 passos',
            minutes: 15,
            content:
              'Gancho nos primeiros dois segundos, promessa clara, entrega em tópicos curtos, prova e chamada para ação.\n\nGrave três roteiros hoje usando a mesma estrutura e compare o alcance de cada um na próxima semana.',
          },
        ],
      },
      {
        title: 'Vendas',
        lessons: [
          {
            title: 'Do comentário ao direct',
            minutes: 11,
            content:
              'Todo comentário é um convite para conversar. Responda em público e continue no direct com uma pergunta aberta.\n\nEvite mandar o preço logo de cara: entenda a necessidade antes de oferecer.',
          },
          {
            title: 'Fechando a primeira venda',
            minutes: 13,
            content:
              'Resuma o que a pessoa contou, apresente a solução com as palavras dela e deixe o próximo passo fácil: link de pagamento ou agendamento.\n\nDepois da venda, peça um depoimento. Ele vira o próximo conteúdo que vende.',
          },
        ],
      },
    ],
  },
  {
    slug: 'reels-que-vendem',
    title: 'Reels que vendem',
    summary: 'Grave e edite vídeos curtos com o celular, do roteiro à capa.',
    description:
      'Para quem já posta e quer vídeos com mais qualidade sem equipamento caro. Luz, som, enquadramento, cortes e legendas, tudo com o celular e apps gratuitos.',
    level: 'Intermediário',
    modules: [
      {
        title: 'Gravação',
        lessons: [
          {
            title: 'Luz e som com o celular',
            minutes: 9,
            content:
              'Grave de frente para uma janela e longe de paredes que fazem eco. Um fone com microfone já melhora muito o áudio.\n\nTeste: grave a mesma frase em três lugares da casa e escolha o melhor.',
          },
          {
            title: 'Enquadramento',
            minutes: 8,
            content:
              'Olhos no terço superior da tela, celular na altura do rosto e espaço livre para as legendas embaixo.\n\nDeixe a câmera parada: tripé ou uma pilha de livros resolve.',
          },
        ],
      },
      {
        title: 'Edição',
        lessons: [
          {
            title: 'Cortes e ritmo',
            minutes: 12,
            content:
              'Corte pausas, respirações e repetições. Um corte a cada dois ou três segundos mantém a atenção.\n\nNo fim, assista sem som: se ainda faz sentido, a edição está boa.',
          },
          {
            title: 'Legendas e capa',
            minutes: 7,
            content:
              'Boa parte das pessoas assiste sem som, então legenda não é opcional. Use frases curtas e destaque a palavra mais importante.\n\nA capa precisa funcionar no perfil: título grande, rosto visível e as mesmas cores em todos os Reels.',
          },
        ],
      },
    ],
  },
]
