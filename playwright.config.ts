import { defineConfig, devices } from '@playwright/test';

// ── Detect active environment from --project CLI flag ─────────────────────────
//
// Playwright worker processes inherit process.env from the parent, so setting
// TEST_ENV here makes it available in every helper and spec file at runtime.
//
// Examples:
//   npx playwright test --project=development   → TEST_ENV=development
//   npx playwright test --project=staging       → TEST_ENV=staging
//
// TEST_ENV can also be set manually in CI:
//   TEST_ENV=staging npx playwright test

function detectEnvironment(): string {
  // 1. Explicit env var takes highest priority (useful in CI pipelines)
  //    TEST_ENV=staging npx playwright test
  if (process.env.TEST_ENV) return process.env.TEST_ENV;

  // 2. --project=staging  (equals format — standard Playwright CLI)
  const equalsArg = process.argv.find(arg => arg.startsWith('--project='));
  if (equalsArg) return equalsArg.split('=')[1];

  // 3. --project staging  (space format)
  const spaceIndex = process.argv.indexOf('--project');
  if (spaceIndex !== -1 && process.argv[spaceIndex + 1]) {
    return process.argv[spaceIndex + 1];
  }

  // 4. Default
  return 'development';
}

process.env.TEST_ENV = detectEnvironment();

// Import after TEST_ENV is set so env.config.ts reads the correct value
import { getEnvConfig } from './helpers/env.config';
const envConfig = getEnvConfig();

// ── Config ────────────────────────────────────────────────────────────────────

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL:            envConfig.baseURL,
    headless:           false,
    trace:              'on-first-retry',
    screenshot:         'only-on-failure',
    video:              'retain-on-failure',
  },

  projects: [
    {
      name: 'development',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://newadmin.dev.trudiagnostic.com',
      },
    },
    {
      name: 'staging',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://newadmin.staging.trudiagnostic.com',
      },
    },
  ],
});
