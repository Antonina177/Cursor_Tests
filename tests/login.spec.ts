import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

// Test credentials - in production, use environment variables
const TEST_USERNAME = 'antonina.horbenko+myadmin@trudiagnostic.com';
const TEST_PASSWORD = 'Passw0rd!';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('successful login with valid credentials', async ({ page }) => {
    // Verify we are on the sign-in page
    await expect(page).toHaveURL(/sign-in/);
    await expect(loginPage.usernameInput()).toBeVisible();
    await expect(loginPage.passwordInput()).toBeVisible();
    await expect(loginPage.signInButton()).toBeVisible();

    // Perform login and wait for navigation away from sign-in page
    await loginPage.loginAndWaitForNavigation(TEST_USERNAME, TEST_PASSWORD);

    // Assert: User is redirected away from sign-in page
    await expect(page).not.toHaveURL(/sign-in/);
    await expect(page).toHaveURL(/newadmin\.dev\.trudiagnostic\.com/);
  });

  test('login with wrong password', async ({ page }) => {
    await expect(page).toHaveURL(/sign-in/);

    const wrongPassword = 'WrongPassword123!';
    await loginPage.login(TEST_USERNAME, wrongPassword);

    // Assert: User remains on sign-in page and error message is displayed
    await expect(page).toHaveURL(/sign-in/);
    await expect(loginPage.errorMessage()).toBeVisible();
  });

  test('login with wrong email', async ({ page }) => {
    await expect(page).toHaveURL(/sign-in/);

    const wrongEmail = 'nonexistent.user@example.com';
    await loginPage.login(wrongEmail, TEST_PASSWORD);

    // Assert: User remains on sign-in page and error message is displayed
    await expect(page).toHaveURL(/sign-in/);
    await expect(loginPage.errorMessage()).toBeVisible();
  });
});
