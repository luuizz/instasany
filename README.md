# Instasany

Site institucional e plataforma de cursos (LMS) da Instasany, um curso fictício sobre criar e monetizar perfis no Instagram.

Projeto de estudo em evolução: começou como uma landing page em Next 13 com Prismic e está sendo refeito do zero com Next.js 16, CMS próprio e banco no Neon.

## Stack

- Next.js 16 (App Router) e React 19
- Tailwind CSS 4, com os tokens da marca em `src/app/globals.css`
- GSAP (`@gsap/react`) nas animações, respeitando `prefers-reduced-motion`
- Postgres no Neon com Drizzle ORM e migrations SQL versionadas
- Neon Auth com sessão em cookie no domínio do site, tudo via Server Actions
- CMS próprio em `/admin` para todas as seções da home e o rodapé
- LMS: catálogo, matrícula, aulas com vídeo e texto, progresso do aluno e gestão de cursos no painel
- Vercel Blob para vídeos e capas, com player próprio nas cores da marca
- TypeScript strict, ESLint e Prettier

## Rodando localmente

```bash
nvm use        # Node 22
yarn install
cp .env.example .env.local   # preencha o que tiver; sem banco o site usa o conteúdo padrão
yarn db:migrate              # com DATABASE_URL
yarn dev                     # http://localhost:3000
```

## Scripts

| Comando          | O que faz                       |
| ---------------- | ------------------------------- |
| `yarn dev`       | servidor local (Turbopack)      |
| `yarn build`     | build de produção               |
| `yarn lint`      | ESLint                          |
| `yarn format`    | Prettier (`format:check` no CI) |
| `yarn typecheck` | checagem de tipos (TS 7)        |

## Fluxo de trabalho

`feat/*` → PR para `dev` → PR de release `dev` → `main`. O CI roda lint, formatação, tipos, build e as migrations num Postgres de teste em todo PR; o merge na `main` aplica as migrations no Neon.

## Roteiro

- [x] Base nova: header, hero e vitrine responsivos
- [x] Backend: banco no Neon, login e CMS próprio para o conteúdo do site
- [x] Demais seções: benefícios, para quem é, preços, sobre nós, FAQ e rodapé, todas editáveis no painel
- [x] LMS: cursos, módulos, aulas, matrícula e progresso do aluno
- [x] Deploy na Vercel com migrations automáticas
