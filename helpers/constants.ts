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

export const BASE_URL           = env.baseURL;
/** Ops/admin API — used for auth, corporations, inventory, scan */
export const API_BASE_URL       = env.apiBaseURL;
/** External order API — used for creating orders with API key auth */
export const ORDER_API_BASE_URL = env.orderApiBaseURL;
/** API key for the external order API */
export const API_KEY            = env.apiKey;

// ── API endpoints ─────────────────────────────────────────────────────────────

export const API_ENDPOINTS = {
  // Ops/admin API (Bearer token auth)
  auth:             `${API_BASE_URL}/portalApi/Auth`,
  corporations:     `${API_BASE_URL}/api/admin/corporations`,
  createInventory:  `${API_BASE_URL}/api/admin/inventory/generate`,
  scanOrder:        (orderId: string | number) =>
                      `${API_BASE_URL}/api/admin/orders/${orderId}/scan`,

  // External order API (API key auth)
  createOrder:      `${ORDER_API_BASE_URL}/api/orders`,
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
