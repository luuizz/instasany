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
}
