# CLAUDE.md

Site institucional e LMS da Instasany (curso fictício). Next.js 16 (App Router), React 19, Tailwind 4, GSAP. Gerenciador: **yarn**.

## Comandos

```bash
yarn dev | yarn build | yarn lint | yarn format | yarn typecheck
```

Antes de entregar qualquer mudança: `yarn format && yarn lint && yarn typecheck && yarn build`.

## Git, commits e PRs

- Não colocar marca do Claude/Anthropic em commits nem PRs (nada de `Co-Authored-By`, link de sessão ou "Generated with").
- Esteira `feat/* → dev → main`; o dono do repo faz os merges.
- Commits em português, Conventional Commits (`feat(escopo): ...`).

## Estrutura

```
src/
  app/(site)/     site institucional (layout com cabeçalho)
  components/
    ui/           primitivos sem regra de negócio (container, button)
    layout/       cabeçalho, menu, rodapé
    home/         seções da home; animação de cada seção num hook use-*-animation.ts ao lado
  config/         identidade e navegação (site.ts)
  data/           conteúdo provisório (vai para o CMS)
  lib/            utilitários (cn)
  types/          tipos compartilhados
```

## Estilo

- Cores e medidas pelos tokens de `src/app/globals.css` (`pine`, `pine-line`, `sage`, `sage-light`, `lime`, `ink`, `paper`; `max-w-grid`, `max-w-hero-*`, `max-w-cards`). Nada de hex no componente.
- Mobile first; a composição desktop das seções começa em `lg`.
- Animações com `useGSAP` e `gsap.matchMedia`, sempre com o caso `prefers-reduced-motion: reduce`.
- Server Components por padrão; `'use client'` só onde há estado, efeito ou animação.
- Textos da interface em português do Brasil.
