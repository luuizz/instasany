# CLAUDE.md

Site institucional e LMS da Instasany (curso fictício). Next.js 16 (App Router), React 19, Tailwind 4, GSAP,
Postgres no Neon com Drizzle, Neon Auth. Gerenciador: **yarn**.

## Comandos

```bash
yarn dev | yarn build | yarn lint | yarn format | yarn typecheck
yarn db:generate   # gera a migration SQL depois de mudar src/server/db/schema.ts
yarn db:migrate    # aplica as migrations de database/migrations (CI e merge na main)
yarn e2e           # Playwright contra o build, com login de teste (ver e2e/README.md)
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
    (auth)/       entrar e cadastro (tela dividida com AuthShowcase, abas AuthSwitch), com as Server Actions de login em actions.ts
    (admin)/      painel /admin (CMS); só admin, conferido no layout
    (site)/cursos catálogo público e página do curso, com a matrícula (actions.ts)
    (aluno)/      área do aluno com moldura própria (StudentShell, sem o cabeçalho do site): início (services/student-dashboard.ts), /aluno/cursos, /aluno/explorar (catálogo e prévia do curso com matrícula, sem sair para o site público), /aluno/certificados, /aluno/perfil e a tela da aula (/aluno/cursos/[slug]/aulas/[id])
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
    student/      moldura da área do aluno (student-shell: paleta clara própria, tema claro/escuro/automático e menu recolhível, guardados nos cookies aluno-tema e aluno-menu; abas embaixo no celular) e blocos do início
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
- Papéis em `lib/roles.ts`: `student`, `instructor` e `admin` (o admin troca no detalhe do aluno). Instrutor entra no painel só em `/admin/cursos` (edita dados, módulos, aulas, quizzes e materiais; não cria nem exclui curso) e, como equipe (`isStaff`), vê qualquer curso sem matrícula e aparece como "Equipe" nas dúvidas. Ações do conteúdo dos cursos usam `requireStaff`; o resto do painel, `requireAdmin` (que manda o instrutor para os cursos).
- Senha esquecida: `/esqueci-senha` chama `auth.requestPasswordReset` (o Neon Auth envia o e-mail) e o link volta para `/redefinir-senha?token=` (`(auth)/password-actions.ts`); a resposta não revela se o e-mail existe. O aluno troca nome e senha em `/aluno/perfil` (o nome é gravado no `profiles` e no Neon Auth).
- Conteúdo do site: tabela `site_sections` (uma linha por seção, `data` em jsonb validado pelo schema da seção). Seção nova: schema em `lib/validation/site-content.ts`, padrão em `data/home.ts`, campos em `config/cms.ts` (tipos `text`, `textarea`, `lines` = um item por linha, `number`, `checkbox` e `list` para itens repetidos, lida por `lib/cms-form.ts`).
- Página pública do curso (`(site)/cursos/[slug]`): seções em `components/courses/page/` (hero, o que vai aprender, ementa, o que está incluso, certificado, avaliações, cartão lateral de matrícula), FAQ fixo de `data/course-faq.ts` e outros cursos. A seção "Sobre nós" da home tem um bento com prévias animadas da plataforma (`home/product/`: área do aluno, quiz e certificado, em HTML ilustrativo, animadas em loop pelo `use-product-animation` só enquanto estão na tela) e a faixa de números do painel (`home/about-stats.tsx`, com `ui/count-up.tsx`).
- Listagem pública `/cursos`: `listCatalog()` (catálogo em cache com a tag `courses` + nota média com a tag `reviews`) e `CourseCatalog` (busca sem acento e filtro por nível no navegador). Capa sem imagem usa a utilidade `cover-art` do `globals.css`.
- LMS: `courses` → `course_modules` → `lessons`, com `enrollments` e `lesson_progress`. Leitura em `services/courses.ts` (catálogo publicado em cache com a tag `courses`), escrita do painel em `services/course-admin.ts`, matrícula e progresso em `services/learning.ts` (confere matrícula; admin vê tudo, até rascunho).
- Tela da aula: o player volta para onde a pessoa parou (`lesson_positions`, salvo pelo `use-resume-position` a cada 15 s, na pausa e ao sair; no fim do vídeo volta a 0). Materiais de apoio ficam em `lesson_attachments` (upload `attachment` no Blob, salvo na hora pelo `LessonAttachmentsManager`); excluir aula, módulo ou curso apaga também esses arquivos.
- Quiz por módulo (`quizzes` → `quiz_questions`, tentativas em `quiz_attempts`; `services/quiz.ts`): o painel edita em `/admin/cursos/[id]/modulos/[modulo]/quiz` e salva o quiz inteiro de uma vez; o aluno responde em `/aluno/cursos/[slug]/quiz/[modulo]`. A correção é no servidor e a resposta certa só vai para o navegador depois do envio. Concluir a última aula de um módulo com quiz pendente leva ao quiz.
- Certificado (`certificates`, `services/certificates.ts`): liberado quando todas as aulas estão concluídas e todos os quizzes aprovados; o aluno emite pela lateral da aula (`CourseAside`) e a página pública `/certificado/[codigo]` confere pelo código e imprime. Nome, curso e carga ficam gravados como estavam na emissão. Para o dono, a página mostra "Adicionar ao perfil" e "Compartilhar" no LinkedIn (links públicos em `lib/linkedin.ts`, sem API) e a prévia do link vem de `opengraph-image.tsx`.
- Avaliação do curso (`course_reviews`, `services/reviews.ts`): nota de 1 a 5 e comentário opcional, uma por aluno matriculado; a página do curso mostra a média e os comentários com o primeiro nome.
- Anotações por aula (`lesson_notes`, `services/notes.ts`): uma por aluno e aula, só a pessoa vê. O bloco `lms/lesson-notes.tsx` salva sozinho (`use-autosave-note`: ao parar de digitar, ao sair do campo e ao esconder a página; texto vazio apaga) e `/aluno/anotacoes` reúne tudo por curso, com busca.
- Sequência de estudo e conquistas (`services/achievements.ts`, regras puras em `lib/streak.ts` e `lib/achievements.ts`): calculadas na hora, sem tabela. Conta como dia de estudo aula concluída, quiz, anotação ou vídeo assistido, no fuso de São Paulo; a sequência continua viva até o fim do dia seguinte. O início do aluno mostra `StreakCard` e `AchievementsGrid`.
- Notificações no sino (`notifications`, `services/inbox.ts`): `pushNotification` cria o aviso (resposta de dúvida em `notifyAnswer`, matrícula em `notifyEnrollment`, certificado novo em `issueCertificateAction`). O `NotificationBell` fica no topo do menu da área do aluno e na barra do celular, começa com o que o layout leu e se atualiza a cada minuto com a aba visível (`use-inbox`).
- Dúvidas por aula (`lesson_questions`, `services/questions.ts`): a pergunta abre a conversa (`parent_id` nulo) e as respostas apontam para ela. Todos os matriculados no curso veem e respondem; a equipe aparece com o selo "Equipe" e responde também pela fila `/admin/duvidas` (sem resposta da equipe primeiro). Quem escreveu apaga a própria mensagem; admin apaga qualquer uma.
- E-mails pelo Resend (`server/integrations/email.ts`, layout e textos em `server/emails/`, envio e registro em `services/notifications.ts`, sempre com `after()`): boas-vindas no cadastro, matrícula, resposta de dúvida e lembrete de inatividade. O lembrete sai pelo Cron da Vercel (`vercel.json` → `/api/cron/lembretes`, protegido por `CRON_SECRET`): aluno parado há 7 dias recebe um por pausa (`email_log`), se não desligou em Meu perfil. Sem `RESEND_API_KEY`/`EMAIL_FROM` o envio é só registrado no log.
- Liberação gradual: `lessons.release_after_days` (0 = abre na matrícula). A regra fica em `lib/release.ts`; aula fechada não entrega texto, vídeo nem materiais, não pode ser concluída, aparece com cadeado e data na lista, e o quiz do módulo só abre quando todas as aulas dele abriram. Admin sem matrícula vê tudo aberto.
- Matrícula é gratuita (projeto fictício). Ordem de módulos e aulas por `sort_order`, trocada com o vizinho.
- Vídeos e capas: upload direto do navegador para o Vercel Blob (`components/admin/media-field.tsx` + `api/uploads`); limites em `lib/media.ts`. Arquivo trocado ou excluído sai do Blob com `after()`. Sem `BLOB_READ_WRITE_TOKEN` o painel aceita só a URL.
- Cabeçalho do site: fixo no topo, sem fundo próprio sobre a faixa escura e virando pílula flutuante ao rolar (`layout/header-shell.tsx`); menu em `config/site.ts` (`mainNav`: "Cursos" é página, o resto são âncoras da home, destacadas pelo `SiteNav`) e busca em `layout/site-search.tsx` (Command do shadcn, abre pelo botão, `/` ou ⌘K/Ctrl+K, e procura no catálogo de `listCatalog` pelo título, resumo, nível, módulos e aulas). As páginas públicas são estáticas, então o cabeçalho descobre quem está logado no navegador (`layout/header-account-context.tsx` chama a action `getHeaderAccountAction` uma vez por montagem). Visitante vê "Fazer login"; aluno vê o nome; admin vê também "Painel". A área do aluno não usa o cabeçalho do site: tem a própria moldura (`components/student/student-shell.tsx`).
- Painel: `/admin` é a visão geral (números de `services/dashboard.ts`), `/admin/cursos`, `/admin/alunos` (lista com busca e detalhe com cursos, progresso, papel e atividade; `services/students.ts`), `/admin/analise` e `/admin/conteudo`. Cada página entra com o `template.tsx` e mostra o `loading.tsx` enquanto carrega.
- Listas do painel (cursos, seções do site) alternam entre grade e lista (`components/admin/view-toggle.tsx`); a escolha fica no cookie `painel-visualizacao`, lido no servidor por `server/admin-view.ts`.
- Análise de uso própria (sem gtag): tabela `analytics_events`. O navegador envia `page_view`, `video_play` e `video_watch` pela action `trackEventAction` (`components/analytics/track.ts`, com id aleatório no localStorage e respeito a Do Not Track/GPC); `enrollment` e `lesson_complete` são gravados pelo servidor com `after()`. Uso de admin não é gravado. Relatórios em `services/analytics-report.ts` (SQL puro via `db/raw.ts`, dias no fuso de São Paulo). A página `/privacidade` explica o que é medido; evento novo entra nela.
- Telas de erro: `components/errors/error-screen.tsx` (código ao fundo, ícone, texto e ações). `app/not-found.tsx` é a 404 de endereço inexistente (tela cheia); `(site)`, `(aluno)/aluno` e `(admin)/admin` têm `error.tsx` (com `ErrorActions`: tentar de novo e código do erro) e as duas primeiras também `not-found.tsx`, dentro das próprias molduras; `app/global-error.tsx` cobre erro no layout raiz.
- SEO: `app/sitemap.ts` (home, catálogo, cursos publicados) e `app/robots.ts` (fora a área do aluno, o painel e o login); dados estruturados de `lib/seo/json-ld.ts` com o componente `seo/json-ld.tsx` (organização e site na home, curso e trilha na página do curso); imagens de prévia em `opengraph-image.tsx` (padrão do site, por curso e por certificado), com as peças comuns em `lib/seo/og.tsx`.
- Actions que mudam conteúdo público usam `updateTag` (expira o cache na hora) + `revalidatePath`.
- A home lê o conteúdo por `getHomeContent()`: o cache guarda só as linhas do banco e o encaixe nos padrões é feito a cada leitura, então formato novo nunca depende de cache antigo.

## Estilo

- Componentes de interface vêm do shadcn/ui (`components.json`): `npx shadcn@latest add <componente>` cria o arquivo em `components/ui`, que é nosso e pode ser ajustado. Os tokens do shadcn (`primary`, `muted`, `border`, `ring`...) estão em `globals.css` apontando para as cores da marca; ícones com `lucide-react`.
- Formulário: campo com rótulo e dica é `LabeledField` e mensagem de erro/sucesso é `FormMessage` (`ui/form-field.tsx`); controles do shadcn (`Input`, `Textarea`, `Select`, `Switch`, `Checkbox`) com `name` para entrar no `FormData`. `ui/field.tsx` é o `Field` do próprio shadcn, usado para layouts horizontais (switch + descrição).
- Topo das páginas do painel é `PageHeader` (`admin/page-header.tsx`): trilha (`breadcrumbs`), selo de status, ações e, para ação destrutiva, `ActionsMenu` (menu "⋯" com confirmação).
- Sanfonas são `Accordion` (FAQ, ementa), menus laterais são `Sheet`, dicas de botão são `Tooltip` (o `TooltipProvider` está no layout raiz), iniciais de usuário são `Avatar`.
- Confirmação é `ConfirmDialog`/`ConfirmButton` (`ui/confirm-dialog.tsx`), nunca `window.confirm`. Sucesso de formulário vira toast (`useFormAction(..., 'mensagem')`); erro fica no formulário.
- Só a área do aluno tem tema escuro: `dark:` vale dentro de `.dark` (`@custom-variant` no `globals.css`), que o `StudentShell` põe no `<html>` enquanto ela está aberta; o site público e o painel ficam sempre claros. No `.dark`, `ink` vira texto claro e os tokens do shadcn mudam; para fundo escuro fixo (player, capas, sobreposições) use `night`, superfícies usam `bg-card` e texto verde-pinho leva `dark:text-lime`. Trecho que deve continuar claro dentro do escuro usa `light-surface`.
- Ícones sempre do `lucide-react` (nada de emoji, seta em texto ou SVG de ícone em `public/`).
- Animações de interface com as classes do `tw-animate-css` (`animate-in fade-in slide-in-from-bottom-2`, atraso com `style={{ animationDelay }}` + `fill-mode-both`); `prefers-reduced-motion` desliga todas no `globals.css`.

- Cores e medidas pelos tokens de `src/app/globals.css` (`pine`, `pine-line`, `sage`, `sage-light`, `lime`, `ink`, `paper`; `max-w-grid`, `max-w-hero-*`, `max-w-cards`). Nada de hex no componente.
- Mobile first; a composição desktop das seções começa em `lg`.
- Animações com `useGSAP` e `gsap.matchMedia`, sempre com o caso `prefers-reduced-motion: reduce`.
- Server Components por padrão; `'use client'` só onde há estado, efeito ou animação.
- Textos da interface em português do Brasil.
