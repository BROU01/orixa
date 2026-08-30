import { defineConfig, devices } from '@playwright/test';

/**
 * Tests de fumée exécutés contre un VRAI BUILD DE PRODUCTION (`next build`
 * + `next start`), pas contre `next dev`. C'est volontaire : le bug qui a
 * motivé cette suite (404 systématique sur /produit) n'existait qu'en
 * production, car `next dev` rend toujours les pages dynamiquement et
 * aurait masqué la régression.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3400',
  },
  webServer: {
    command: 'npm run build && npm run start -- -p 3400',
    url: 'http://localhost:3400',
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
