// ─────────────────────────────────────────────────────────────────────────────
// Shared test constants — environment-aware
//
// All values are derived from the active environment config (env.config.ts).
// The active environment is set via TEST_ENV, which playwright.config.ts
// injects automatically based on the --project flag.
//
// Import from this file in tests; never import from env.config.ts directly.
// ─────────────────────────────────────────────────────────────────────────────

import { getEnvConfig } from './env.config';

const env = getEnvConfig();

// ── Credentials ───────────────────────────────────────────────────────────────

export const TEST_USERNAME    = env.username;
export const TEST_PASSWORD    = env.password;

// ── Test data ─────────────────────────────────────────────────────────────────

/** Customer name used in order-related tests — differs per environment */
export const CUSTOMER_SEARCH  = env.customerSearch;

// ── Base URLs ─────────────────────────────────────────────────────────────────

export const BASE_URL         = env.baseURL;
export const API_BASE_URL     = env.apiBaseURL;

// ── API endpoints ─────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  auth:         `${API_BASE_URL}/portalApi/Auth`,
  corporations: `${API_BASE_URL}/api/admin/corporations`,
};

// ── Page URLs ─────────────────────────────────────────────────────────────────

export const URLS = {
  signIn:       `${BASE_URL}/sign-in`,
  admin:        `${BASE_URL}/admin`,
  corporations: `${BASE_URL}/corporations`,
  orders:       `${BASE_URL}/orders`,
  ordersList:   `${BASE_URL}/orders/list`,
  kits:         `${BASE_URL}/kits`,
  patients:     `${BASE_URL}/patients`,
};
