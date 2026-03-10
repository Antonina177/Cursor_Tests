import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly url = '/sign-in';

  // Stable selectors - IDs are most resilient, role-based for button
  readonly usernameInput = () => this.page.locator('#username');
  readonly passwordInput = () => this.page.locator('#password');
  readonly signInButton = () => this.page.getByRole('button', { name: 'Sign in' });

  // Error message shown when login fails (wrong credentials or no admin permission)
  readonly errorMessage = () =>
    this.page.getByText("You don't have permission to access the admin portal");

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput().fill(username);
    await this.passwordInput().fill(password);
    await this.signInButton().click();
  }

  async loginAndWaitForNavigation(username: string, password: string): Promise<void> {
    await Promise.all([
      this.page.waitForURL(url => !url.pathname.includes('/sign-in'), { waitUntil: 'domcontentloaded' }),
      this.login(username, password),
    ]);
  }
}
