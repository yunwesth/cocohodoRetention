import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/live', outputDir: 'test-results/live', fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:3101', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start -- --port 3101', url: 'http://127.0.0.1:3101', reuseExistingServer: false, timeout: 120000,
    env: {
      COCOHODO_TEST_DIST_DIR: '.next-live',
      NEXT_PUBLIC_SUPABASE_URL: 'https://cocohodo-test.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-public-key',
    },
  },
});
