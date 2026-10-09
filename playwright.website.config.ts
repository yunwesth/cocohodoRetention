import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/website', outputDir: 'test-results/website', fullyParallel: true,
  use: { baseURL: 'http://localhost:3001', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: [
    { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI, env: { NEXT_PUBLIC_SUPABASE_URL: '', NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '', NEXT_PUBLIC_WEBSITE_URL: 'http://localhost:3001' }, timeout: 120000 },
    { command: 'npm run dev:website', url: 'http://localhost:3001', reuseExistingServer: !process.env.CI, env: { NEXT_PUBLIC_SITE_URL: 'http://localhost:3001', NEXT_PUBLIC_REWARDS_URL: 'http://localhost:3000', WEBSITE_PUBLIC_LAUNCH: 'false', NEXT_PUBLIC_REWARDS_LIVE: 'false' }, timeout: 120000 },
  ],
});
