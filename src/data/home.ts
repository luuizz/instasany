import type { HomeContent } from '@/types/home'

// Conteúdo padrão da home: vale até a seção ser salva no painel (/admin/conteudo)
export const homeContent: HomeContent = {
  hero: {
    eyebrow: 'Novo curso focado em Instagram',
    title: 'Faça sua primeira renda online começando do zero',
    waitlistLabel: 'Entrar na lista de espera',
    waitlistHref: '#precos',
    ctaLabel: 'Começar agora',
    ctaHref: '#precos',
  },
  showcase: {
    titleStart: 'Faça',
    titleHighlight: 'você',
    titleEnd: 'mesmo de casa',
    cards: [
      { src: '/images/card-01.png', alt: '', decorative: true },
      { src: '/images/card-02.png', alt: 'Mulher sorrindo sob luz neon' },
      { src: '/images/card-03.png', alt: 'Pessoa com guarda-chuva atravessando uma rua iluminada à noite' },
      { src: '/images/card-04.png', alt: 'Duas amigas posando para a câmera vista de baixo' },
      { src: '/images/card-05.png', alt: 'Mulher fazendo bola de chiclete sob luz neon' },
      { src: '/images/card-06.png', alt: '', decorative: true },
    ],
  },
  benefits: {
    eyebrow: 'Benefícios',
    title: 'Tudo o que você precisa para crescer no Instagram',
    items: [
      {
        title: 'Aulas curtas e práticas',
        text: 'Aulas de até 15 minutos para assistir no intervalo e aplicar no mesmo dia.',
      },
      {
        title: 'Do perfil ao primeiro cliente',
        text: 'Posicionamento, bio, conteúdo e venda pelo direct, na ordem certa.',
      },
      {
        title: 'Roteiros e modelos prontos',
        text: 'Calendário de posts, roteiros de Reels e modelos de legenda para adaptar.',
      },
      { title: 'Comunidade de alunos', text: 'Troque ideias, peça opinião sobre o seu perfil e encontre parcerias.' },
      { title: 'Acesso por 1 ano', text: 'Assista quantas vezes quiser, no celular ou no computador.' },
      { title: 'Certificado de conclusão', text: 'Termine as trilhas e baixe o certificado direto na área do aluno.' },
    ],
  },
  audience: {
    eyebrow: 'Para quem é o curso',
    title: 'Feito para quem quer começar de casa',
    description:
      'Você não precisa de muitos seguidores nem de equipamento caro. Precisa de método, constância e um celular na mão.',
    items: [
      'Quem quer transformar o Instagram em fonte de renda',
      'Pequenos negócios que vendem pelo direct',
      'Criadores de conteúdo começando do zero',
      'Profissionais que querem atrair clientes pelo perfil',
      'Quem já tentou, mas não viu o perfil crescer',
    ],
    ctaLabel: 'Ver os planos',
    ctaHref: '#precos',
  },
  pricing: {
    eyebrow: 'Preços promocionais',
    title: 'Escolha o plano para começar',
    note: 'Preço de lançamento por tempo limitado. Se não gostar, devolvemos o valor em até 7 dias.',
    ctaHref: '/cadastro',
    plans: [
      {
        name: 'Essencial',
        description: 'Para dar os primeiros passos com método.',
        price: 197,
        compareAt: 297,
        period: 'pagamento único',
        features: [
          'Trilha completa de aulas',
          'Modelos de legenda e roteiros',
          'Acesso por 1 ano',
          'Certificado de conclusão',
        ],
        ctaLabel: 'Quero o Essencial',
        highlight: false,
      },
      {
        name: 'Completo',
        description: 'O curso inteiro com acompanhamento da comunidade.',
        price: 397,
        compareAt: 597,
        period: 'ou 12x de R$ 33,08',
        features: [
          'Tudo do Essencial',
          'Comunidade de alunos',
          'Aulas ao vivo todo mês',
          'Análise do seu perfil em vídeo',
          'Bônus: kit de templates para Stories',
        ],
        ctaLabel: 'Quero o Completo',
        highlight: true,
      },
      {
        name: 'Mentoria',
        description: 'Para acelerar com acompanhamento individual.',
        price: 897,
        compareAt: 1197,
        period: 'ou 12x de R$ 74,75',
        features: [
          'Tudo do Completo',
          '4 encontros individuais',
          'Plano de conteúdo para 90 dias',
          'Suporte direto pelo WhatsApp',
        ],
        ctaLabel: 'Quero a Mentoria',
        highlight: false,
      },
    ],
  },
  about: {
    eyebrow: 'Sobre nós',
    title: 'Quem está por trás da Instasany',
    paragraphs: [
      'A Instasany nasceu de uma pergunta simples: por que tanta gente boa no que faz não consegue vender pelo Instagram?',
      'Juntamos criadores, social medias e pequenos empreendedores para transformar o que funciona no dia a dia em aulas diretas, sem fórmula mágica e sem promessa de ficar rico.',
    ],
    stats: [
      { value: '+12 mil', label: 'alunos formados' },
      { value: '180', label: 'aulas na plataforma' },
      { value: '4,9', label: 'nota média das aulas' },
      { value: '2019', label: 'ensinando online' },
    ],
  },
  faq: {
    eyebrow: 'Dúvidas',
    title: 'Perguntas frequentes',
    items: [
      {
        question: 'Preciso ter muitos seguidores para começar?',
        answer:
          'Não. O curso começa do posicionamento do perfil e funciona para quem está com poucos ou nenhum seguidor.',
      },
      {
        question: 'Por quanto tempo tenho acesso às aulas?',
        answer: 'Por 1 ano a partir da compra, com todas as atualizações que entrarem nesse período.',
      },
      {
        question: 'Consigo assistir pelo celular?',
        answer: 'Sim. A área do aluno funciona no navegador do celular e do computador, e salva onde você parou.',
      },
      {
        question: 'E se eu não gostar?',
        answer: 'Você tem 7 dias de garantia. Se não fizer sentido para você, devolvemos o valor integral.',
      },
      {
        question: 'Recebo certificado?',
        answer: 'Sim. Ao concluir as trilhas, o certificado fica disponível para baixar na área do aluno.',
      },
    ],
  },
  footer: {
    tagline: 'Curso online para criar, crescer e monetizar seu perfil no Instagram, de casa e no seu ritmo.',
    email: 'contato@instasany.com.br',
    socials: [
      { label: 'Instagram', href: 'https://instagram.com' },
      { label: 'YouTube', href: 'https://youtube.com' },
      { label: 'TikTok', href: 'https://tiktok.com' },
    ],
  },
}
