import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

// ─── Constants ────────────────────────────────────────────────────────────────

const TEST_USERNAME = 'antonina.horbenko+myadmin@trudiagnostic.com';
const TEST_PASSWORD = 'Passw0rd!';

const URLS = {
  adminDashboard: 'https://newadmin.dev.trudiagnostic.com/admin',
  corporations:   'https://newadmin.dev.trudiagnostic.com/corporations',
} as const;

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Generates a unique corporation name for each test run.
 * Format: Automation_<timestamp><random2digits>
 * Example: Automation_17431234561242
 */
function generateCorporationName(): string {
  const randomSuffix = Math.floor(Math.random() * 90 + 10); // 10–99
  return `Automation_${Date.now()}${randomSuffix}`;
}

// ─── Page Object: CorporationsPage ───────────────────────────────────────────

class CorporationsPage {
  constructor(private readonly page: Page) {}

  // Sidebar "Admin" nav link (3rd <a> in the nav)
  adminNavLink = () =>
    this.page.locator('nav a').nth(2);

  // "Corporation Management" card on the Admin dashboard
  corporationManagementCard = () =>
    this.page.getByRole('link', { name: /corporation management/i });

  // "New Corporation" button in the toolbar
  newCorporationButton = () =>
    this.page.getByRole('button', { name: /new corporation/i });

  // Modal overlay
  modal = () =>
    this.page.locator(
      'div.fixed.inset-0.bg-black.bg-opacity-50.flex.items-center.justify-center.z-50',
    );

  // "Corporation Name" text input inside the modal
  corporationNameInput = () =>
    this.modal().locator('input').first();

  // "Create" submit button inside the modal (blue)
  createButton = () =>
    this.modal().getByRole('button', { name: /^create$/i });

  // Generic success toast / confirmation – adjust selector if the app uses a
  // different element (e.g. a toast library). We look for any visible text that
  // indicates success, or simply confirm the modal closed without an error banner.
  errorBanner = () =>
    this.page.getByRole('alert').filter({ hasText: /error|failed|invalid/i });
}

// ─── Test ─────────────────────────────────────────────────────────────────────

test.describe('Create Corporation E2E Test', () => {
  test('should create a new corporation successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const corporationsPage = new CorporationsPage(page);
    const corporationName = generateCorporationName();

    // ── Step 1: Open the login page ──────────────────────────────────────────
    await test.step('Open login page', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL(/sign-in/);
      await expect(loginPage.usernameInput()).toBeVisible();
      await expect(loginPage.passwordInput()).toBeVisible();
    });

    // ── Step 2–4: Fill credentials and sign in ───────────────────────────────
    await test.step('Fill credentials and sign in', async () => {
      await loginPage.loginAndWaitForNavigation(TEST_USERNAME, TEST_PASSWORD);
      await expect(page).not.toHaveURL(/sign-in/);
    });

    // ── Step 5: Click "Admin" in the sidebar ─────────────────────────────────
    await test.step('Navigate to Admin section via sidebar', async () => {
      await corporationsPage.adminNavLink().waitFor({ state: 'visible', timeout: 10_000 });
      await corporationsPage.adminNavLink().click();
    });

    // ── Step 6: Verify Admin dashboard URL ───────────────────────────────────
    await test.step('Verify Admin dashboard page', async () => {
      await expect(page).toHaveURL(URLS.adminDashboard);
    });

    // ── Step 7: Click "Corporation Management" card ──────────────────────────
    await test.step('Click Corporation Management card', async () => {
      await corporationsPage.corporationManagementCard().waitFor({ state: 'visible', timeout: 10_000 });
      await corporationsPage.corporationManagementCard().click();
    });

    // ── Step 8: Verify corporations list URL ─────────────────────────────────
    await test.step('Verify redirect to Corporations page', async () => {
      await expect(page).toHaveURL(URLS.corporations);
    });

    // ── Step 9: Click "New Corporation" button ───────────────────────────────
    await test.step('Open New Corporation modal', async () => {
      await corporationsPage.newCorporationButton().waitFor({ state: 'visible', timeout: 10_000 });
      await corporationsPage.newCorporationButton().click();

      // Assert the modal is visible before interacting
      await expect(corporationsPage.modal()).toBeVisible({ timeout: 5_000 });
    });

    // ── Step 10: Fill Corporation Name ───────────────────────────────────────
    await test.step(`Fill Corporation Name with "${corporationName}"`, async () => {
      await corporationsPage.corporationNameInput().waitFor({ state: 'visible', timeout: 5_000 });
      await corporationsPage.corporationNameInput().fill(corporationName);
      await expect(corporationsPage.corporationNameInput()).toHaveValue(corporationName);
    });

    // ── Step 11: Click "Create" button ───────────────────────────────────────
    await test.step('Submit: click Create button', async () => {
      await expect(corporationsPage.createButton()).toBeEnabled();
      await corporationsPage.createButton().click();
    });

    // ── Expected Results ─────────────────────────────────────────────────────
    await test.step('Verify corporation was created successfully', async () => {
      // The modal should close after successful creation
      await expect(corporationsPage.modal()).toBeHidden({ timeout: 10_000 });

      // User must remain on the corporations page
      await expect(page).toHaveURL(URLS.corporations);

      // No error banner should be visible
      await expect(corporationsPage.errorBanner()).toHaveCount(0);

      // The newly created corporation should appear in the list
      await expect(
        page.getByText(corporationName, { exact: false }),
      ).toBeVisible({ timeout: 10_000 });
    });
  });
});
