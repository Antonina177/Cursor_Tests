import { Page } from '@playwright/test';

export class SidebarComponent {
  readonly page: Page;

  readonly ordersDropdown = () =>
    this.page.locator('#root > div.flex.h-screen > div > nav > div:nth-child(5) > button');
  readonly ordersPageLink = () =>
    this.page.locator('#root > div.flex.h-screen > div > nav > div:nth-child(5) > div > a.flex.items-center.rounded-lg').first();

  constructor(page: Page) {
    this.page = page;
  }

  async openOrdersDropdown(): Promise<void> {
    await this.ordersDropdown().click();
    await this.page.waitForTimeout(300);
  }

  async goToOrdersPage(): Promise<void> {
    await this.ordersPageLink().click();
  }

  async navigateToOrdersViaSidebar(): Promise<void> {
    await this.openOrdersDropdown();
    await this.goToOrdersPage();
  }
}
