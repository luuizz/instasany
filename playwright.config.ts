import { defineConfig, devices } from '@playwright/test'

const port = 3200
const ci = Boolean(process.env.CI)

// Os testes rodam em ordem (um arquivo prepara o que o próximo usa) contra o build de produção
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1,
  retries: ci ? 1 : 0,
  reporter: ci ? [['github'], ['html', { open: 'never', outputFolder: 'e2e/.output/relatorio' }]] : 'list',
  outputDir: 'e2e/.output/resultados',
  use: {
    baseURL: `http://localhost:${port}`,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'retain-on-failure',
    // Opcional: usar um Chromium já instalado em vez do baixado pelo Playwright
    launchOptions: { executablePath: process.env.E2E_CHROMIUM_PATH || undefined },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node e2e/auth-server.mjs',
      url: 'http://127.0.0.1:4100/neondb/auth/ok',
      reuseExistingServer: !ci,
    },
    {
      command: `yarn start -p ${port}`,
      url: `http://localhost:${port}`,
      reuseExistingServer: !ci,
      timeout: 120_000,
    },
  ],
})
