# CLAUDE.md

Site institucional e LMS da Instasany (curso fictício). Next.js 16 (App Router), React 19, Tailwind 4, GSAP,
Postgres no Neon com Drizzle, Neon Auth. Gerenciador: **yarn**.

## Comandos

```bash
yarn dev | yarn build | yarn lint | yarn format | yarn typecheck
yarn db:generate   # gera a migration SQL depois de mudar src/server/db/schema.ts
yarn db:migrate    # aplica as migrations de database/migrations (CI e merge na main)
```

Sem `DATABASE_URL` o site sobe com o conteúdo padrão de `src/data`; sem `NEON_AUTH_*` só o login fica indisponível. Referência das variáveis: `.env.example`.

Antes de entregar qualquer mudança: `yarn format && yarn lint && yarn typecheck && yarn build`.

## Git, commits e PRs

- Não colocar marca do Claude/Anthropic em commits nem PRs (nada de `Co-Authored-By`, link de sessão ou "Generated with").
- Esteira `feat/* → dev → main`; o dono do repo faz os merges.
- Commits em português, Conventional Commits (`feat(escopo): ...`).

## Estrutura

```
src/
  app/
    (site)/       site institucional (layout com cabeçalho)
    (auth)/       entrar e cadastro, com as Server Actions de login em actions.ts
    (admin)/      painel /admin (CMS); só admin, conferido no layout
    (aluno)/      área do aluno /aluno (LMS)
    api/auth/     endpoints do Neon Auth no domínio do site
  proxy.ts        exige login em /admin e /aluno
  components/
    ui/           primitivos sem regra de negócio (container, button)
    layout/       cabeçalho, menu, rodapé
    home/         seções da home; hero e vitrine têm hook use-*-animation.ts, as demais usam ui/reveal-on-scroll (data-reveal-item)
    admin/ auth/  telas do painel e do login
  hooks/          hooks de cliente reaproveitados (use-form-action)
  config/         identidade, navegação e seções editáveis do CMS (cms.ts)
  data/           conteúdo padrão do site, usado enquanto a seção não é salva no painel
  lib/            utilitários que rodam nos dois lados; validation/ tem os schemas Zod
  server/         só servidor (import 'server-only'): db/ (Drizzle), auth/ (sessão), services/ (regras)
  types/          tipos compartilhados, derivados dos schemas Zod
database/migrations/  SQL gerado pelo drizzle-kit; nunca editar uma migration aplicada
```

## Backend

- Fluxo: página/action → `server/services` → `server/db`. Serviço não sabe de cookie nem de cache.
- Gravação é Server Action: valida com o schema de `lib/validation`, confere o acesso (`requireUser`/`requireAdmin`), chama o serviço, revalida o cache e devolve `ActionResult` (`ok`/`fail` de `lib/result`).
- Formulário de action usa `useFormAction` (`hooks/`), que mantém o que foi digitado quando a action devolve erro.
- Login 100% no servidor: `auth.signIn.email`/`signUp.email` nas actions de `(auth)`; o usuário vem de `getSessionUser()`, nunca do navegador.
- Perfil (`profiles`) nasce no primeiro acesso; e-mails de `ADMIN_EMAILS` entram como admin.
- Conteúdo do site: tabela `site_sections` (uma linha por seção, `data` em jsonb validado pelo schema da seção). Seção nova: schema em `lib/validation/site-content.ts`, padrão em `data/home.ts`, campos em `config/cms.ts` (tipos `text`, `textarea`, `lines` = um item por linha, `number`, `checkbox` e `list` para itens repetidos, lida por `lib/cms-form.ts`).
- A home lê o conteúdo por `getHomeContent()`: o cache guarda só as linhas do banco e o encaixe nos padrões é feito a cada leitura, então formato novo nunca depende de cache antigo.

## Estilo

- Cores e medidas pelos tokens de `src/app/globals.css` (`pine`, `pine-line`, `sage`, `sage-light`, `lime`, `ink`, `paper`; `max-w-grid`, `max-w-hero-*`, `max-w-cards`). Nada de hex no componente.
- Mobile first; a composição desktop das seções começa em `lg`.
- Animações com `useGSAP` e `gsap.matchMedia`, sempre com o caso `prefers-reduced-motion: reduce`.
- Server Components por padrão; `'use client'` só onde há estado, efeito ou animação.
- Textos da interface em português do Brasil.
