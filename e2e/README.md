# Testes de ponta a ponta

Playwright contra o build de produção, com um Postgres e um login de teste (`auth-server.mjs`,
o mesmo Better Auth que roda por trás do Neon Auth). Os arquivos rodam em ordem: `02-painel`
cria o admin e os cursos de exemplo que `03-aluno` usa.

No CI roda no job "Testes de ponta a ponta". Para rodar localmente, com um Postgres vazio:

```bash
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/e2e_app   # banco novo, vazio
export E2E_POSTGRES_URL=postgres://postgres:postgres@localhost:5432/postgres
export NEON_AUTH_BASE_URL=http://127.0.0.1:4100/neondb/auth
export NEON_AUTH_COOKIE_SECRET=e2e-cookie-secret-0123456789-0123456789
export ADMIN_EMAILS=admin@e2e.test NEXT_PUBLIC_SITE_URL=http://localhost:3200

yarn db:migrate && yarn build && yarn e2e
```

- Sem `BLOB_READ_WRITE_TOKEN` e `RESEND_API_KEY`: upload e e-mail ficam desligados, como esperado.
- O link de "esqueci a senha" é gravado em `e2e/.output/reset-links.txt`.
- `E2E_CHROMIUM_PATH` aponta para um Chromium já instalado, quando não dá para baixar o do Playwright.
