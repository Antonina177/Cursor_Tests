// ─────────────────────────────────────────────────────────────────────────────
// Environment configuration
//
// Defines settings for every supported environment.
// Tests never read this file directly — they import named exports from
// constants.ts, which calls getEnvConfig() once at module-load time.
//
// Active environment is controlled by the TEST_ENV variable, which is set
// automatically by playwright.config.ts based on the --project flag:
//
//   npx playwright test --project=development
//   npx playwright test --project=staging
// ─────────────────────────────────────────────────────────────────────────────

export interface EnvConfig {
  /** UI base URL (no trailing slash) */
  baseURL: string;
  /** API base URL (no trailing slash) */
  apiBaseURL: string;
  /** Admin portal username */
  username: string;
  /** Admin portal password */
  password: string;
  /** Customer name used in order-related tests */
  customerSearch: string;
}

const configs: Record<string, EnvConfig> = {
  development: {
    baseURL:        'https://newadmin.dev.trudiagnostic.com',
    apiBaseURL:     'https://ops.dev.trudiagnostic.com',
    username:       'antonina.horbenko+myadmin@trudiagnostic.com',
    password:       'Passw0rd!',
    customerSearch: 'Antonina_Migration20',
  },

  staging: {
    baseURL:        'https://newadmin.staging.trudiagnostic.com',
    apiBaseURL:     'https://ops.staging.trudiagnostic.com',
    username:       'antonina.horbenko+myadminstage@trudiagnostic.com',
    password:       'Passw0rd!',
    customerSearch: 'Antonia_Batch_Hold',
  },
};

/**
 * Returns the config object for the currently active environment.
 * Reads TEST_ENV from process.env (set by playwright.config.ts).
 * Falls back to "development" if not set.
 */
export function getEnvConfig(): EnvConfig {
  const env = process.env.TEST_ENV ?? 'development';
  const config = configs[env];

  if (!config) {
    throw new Error(
      `[env.config] Unknown TEST_ENV: "${env}". Valid values: ${Object.keys(configs).join(', ')}`,
    );
  }

  return config;
}
