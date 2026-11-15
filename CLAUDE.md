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
    (site)/cursos catálogo público e página do curso, com a matrícula (actions.ts)
    (aluno)/      área do aluno /aluno: meus cursos e a tela da aula (/aluno/cursos/[slug]/aulas/[id])
    (admin)/admin/cursos  cursos, módulos e aulas (actions.ts)
    api/auth/     endpoints do Neon Auth no domínio do site
    api/uploads/  token de upload direto do navegador para o Vercel Blob (só admin)
  proxy.ts        exige login em /admin e /aluno
  components/
    ui/           primitivos sem regra de negócio, no padrão shadcn/ui (button, input, badge, progress,
                  alert-dialog, sheet, sonner...) mais os da marca (container, field, section-heading)
    layout/       cabeçalho, menu, rodapé
    home/         seções da home; hero e vitrine têm hook use-*-animation.ts, as demais usam ui/reveal-on-scroll (data-reveal-item)
    admin/ auth/  telas do painel e do login
    courses/      card, capa, ementa e progresso (catálogo e área do aluno)
    lms/          player de vídeo próprio e lista de aulas
  hooks/          hooks de cliente reaproveitados (use-form-action)
  config/         identidade, navegação e seções editáveis do CMS (cms.ts)
  data/           conteúdo padrão do site, usado enquanto a seção não é salva no painel
  lib/            utilitários que rodam nos dois lados; validation/ tem os schemas Zod
  server/         só servidor (import 'server-only'): db/ (Drizzle), auth/ (sessão), services/ (regras),
                  integrations/ (Vercel Blob)
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
- LMS: `courses` → `course_modules` → `lessons`, com `enrollments` e `lesson_progress`. Leitura em `services/courses.ts` (catálogo publicado em cache com a tag `courses`), escrita do painel em `services/course-admin.ts`, matrícula e progresso em `services/learning.ts` (confere matrícula; admin vê tudo, até rascunho).
- Tela da aula: o player volta para onde a pessoa parou (`lesson_positions`, salvo pelo `use-resume-position` a cada 15 s, na pausa e ao sair; no fim do vídeo volta a 0). Materiais de apoio ficam em `lesson_attachments` (upload `attachment` no Blob, salvo na hora pelo `LessonAttachmentsManager`); excluir aula, módulo ou curso apaga também esses arquivos.
- Matrícula é gratuita (projeto fictício). Ordem de módulos e aulas por `sort_order`, trocada com o vizinho.
- Vídeos e capas: upload direto do navegador para o Vercel Blob (`components/admin/media-field.tsx` + `api/uploads`); limites em `lib/media.ts`. Arquivo trocado ou excluído sai do Blob com `after()`. Sem `BLOB_READ_WRITE_TOKEN` o painel aceita só a URL.
- Cabeçalho do site: as páginas públicas são estáticas, então o cabeçalho descobre quem está logado no navegador (`layout/header-account-context.tsx` chama a action `getHeaderAccountAction` uma vez por montagem). Visitante vê "Fazer login"; aluno vê o nome; admin vê também "Painel". Na área do aluno o layout passa a conta pronta em `SiteHeader account`.
- Painel: `/admin` é a visão geral (números de `services/dashboard.ts`), `/admin/cursos`, `/admin/alunos` (lista com busca e detalhe com cursos, progresso, papel e atividade; `services/students.ts`), `/admin/analise` e `/admin/conteudo`. Cada página entra com o `template.tsx` e mostra o `loading.tsx` enquanto carrega.
- Listas do painel (cursos, seções do site) alternam entre grade e lista (`components/admin/view-toggle.tsx`); a escolha fica no cookie `painel-visualizacao`, lido no servidor por `server/admin-view.ts`.
- Análise de uso própria (sem gtag): tabela `analytics_events`. O navegador envia `page_view`, `video_play` e `video_watch` pela action `trackEventAction` (`components/analytics/track.ts`, com id aleatório no localStorage e respeito a Do Not Track/GPC); `enrollment` e `lesson_complete` são gravados pelo servidor com `after()`. Uso de admin não é gravado. Relatórios em `services/analytics-report.ts` (SQL puro via `db/raw.ts`, dias no fuso de São Paulo). A página `/privacidade` explica o que é medido; evento novo entra nela.
- Actions que mudam conteúdo público usam `updateTag` (expira o cache na hora) + `revalidatePath`.
- A home lê o conteúdo por `getHomeContent()`: o cache guarda só as linhas do banco e o encaixe nos padrões é feito a cada leitura, então formato novo nunca depende de cache antigo.

## Estilo

- Componentes de interface vêm do shadcn/ui (`components.json`): `npx shadcn@latest add <componente>` cria o arquivo em `components/ui`, que é nosso e pode ser ajustado. Os tokens do shadcn (`primary`, `muted`, `border`, `ring`...) estão em `globals.css` apontando para as cores da marca; ícones com `lucide-react`.
- Formulário: campo com rótulo e dica é `LabeledField` e mensagem de erro/sucesso é `FormMessage` (`ui/form-field.tsx`); controles do shadcn (`Input`, `Textarea`, `Select`, `Switch`, `Checkbox`) com `name` para entrar no `FormData`. `ui/field.tsx` é o `Field` do próprio shadcn, usado para layouts horizontais (switch + descrição).
- Topo das páginas do painel é `PageHeader` (`admin/page-header.tsx`): trilha (`breadcrumbs`), selo de status, ações e, para ação destrutiva, `ActionsMenu` (menu "⋯" com confirmação).
- Sanfonas são `Accordion` (FAQ, ementa), menus laterais são `Sheet`, dicas de botão são `Tooltip` (o `TooltipProvider` está no layout raiz), iniciais de usuário são `Avatar`.
- Confirmação é `ConfirmDialog`/`ConfirmButton` (`ui/confirm-dialog.tsx`), nunca `window.confirm`. Sucesso de formulário vira toast (`useFormAction(..., 'mensagem')`); erro fica no formulário.
- Animações de interface com as classes do `tw-animate-css` (`animate-in fade-in slide-in-from-bottom-2`, atraso com `style={{ animationDelay }}` + `fill-mode-both`); `prefers-reduced-motion` desliga todas no `globals.css`.

- Cores e medidas pelos tokens de `src/app/globals.css` (`pine`, `pine-line`, `sage`, `sage-light`, `lime`, `ink`, `paper`; `max-w-grid`, `max-w-hero-*`, `max-w-cards`). Nada de hex no componente.
- Mobile first; a composição desktop das seções começa em `lg`.
- Animações com `useGSAP` e `gsap.matchMedia`, sempre com o caso `prefers-reduced-motion: reduce`.
- Server Components por padrão; `'use client'` só onde há estado, efeito ou animação.
- Textos da interface em português do Brasil.
