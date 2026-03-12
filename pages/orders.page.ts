import { Page } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;
  readonly url = '/orders/list';

  readonly createOrderButton = () =>
    this.page.getByRole('button', { name: 'Create order' }).or(
      this.page.locator('#root > div.flex.h-screen > main > div > div.mb-4.flex.gap-4 > button')
    );

  readonly ordersTable = () =>
    this.page.locator('table tbody, [role="table"] tbody, tbody').first();
  readonly firstOrderRow = () =>
    this.page.locator('table tbody tr, [role="rowgroup"] tr, tbody tr').first();
  readonly firstOrderRowClickable = () =>
    this.page.locator('table tbody tr a, table tbody tr button, tbody tr [role="button"], tbody tr [role="link"]').first();

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto(this.url);
  }

  async clickCreateOrder(): Promise<void> {
    await this.createOrderButton().click();
  }

  async waitForOrdersList(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.ordersTable().or(this.page.locator('table, [role="table"]')).waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickFirstOrderRow(): Promise<void> {
    const row = this.firstOrderRow();
    const clickable = row.locator('a, button, [role="button"], [role="link"]').first();
    await clickable.click();
  }
}
