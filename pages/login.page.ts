import { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly url = '/sign-in';

  readonly usernameInput = () => this.page.locator('#username');
  readonly passwordInput = () => this.page.locator('#password');
  readonly signInButton = () => this.page.getByRole('button', { name: 'Sign in' });

  // Error message shown when login fails (wrong credentials or no admin permission)
  readonly errorMessage = () =>
    this.page.getByText('Request failed with status code 401');

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
      this.page.waitForURL(url => !url.pathname.includes('/sign-in'), { timeout: 10000 }),
      this.login(username, password),
    ]);
  }
}
