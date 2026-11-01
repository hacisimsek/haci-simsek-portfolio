import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const FEED_PORT = 3101;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    {
      name: 'reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: { reducedMotion: 'reduce' },
      },
    },
  ],
  webServer: [
    {
      command: 'node tests/e2e/feed-server.mjs',
      url: `http://localhost:${FEED_PORT}/users/hacisimsek/repos`,
      reuseExistingServer: !process.env.CI,
    },
    {
      // Drop cached feed responses so the build always reads the current fixtures.
      command: `node -e "require('node:fs').rmSync('.next/cache/fetch-cache', { recursive: true, force: true })" && npm run build && npm run start -- --port ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      env: {
        GITHUB_API_URL: `http://localhost:${FEED_PORT}`,
        MEDIUM_FEED_URL: `http://localhost:${FEED_PORT}/feed/@hacisimsek`,
        RADAR_FIXTURE_URL: `http://localhost:${FEED_PORT}`,
      },
    },
  ],
});
