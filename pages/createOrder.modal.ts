import { Page } from '@playwright/test';

export class CreateOrderModal {
  readonly page: Page;

  readonly modal = () =>
    this.page.locator('.fixed.inset-0').filter({ has: this.page.getByText('Create Regular Order') });

  readonly searchCustomerInput = () =>
    this.page.locator('.fixed.inset-0 form div:nth-child(1) input').first();

  readonly customerDropdownOption = (customerName: string) =>
    this.page.locator('.fixed.inset-0 button').filter({ hasText: customerName }).first();

  readonly productSelect = () =>
    this.page.locator('.fixed.inset-0 form div:nth-child(3) div.space-y-3 div div div:nth-child(1) select');

  readonly notesTextarea = () =>
    this.page.locator('.fixed.inset-0 form div:nth-child(3) textarea').first();

  readonly createOrderButton = () =>
    this.page.locator('.fixed.inset-0 form div.flex.gap-3.justify-end button.px-6').last();

  readonly createRegularOrderModalTitle = () =>
    this.page.getByText('Create Regular Order');

  constructor(page: Page) {
    this.page = page;
  }

  async waitForModal(): Promise<void> {
    await this.createRegularOrderModalTitle().waitFor({ state: 'visible', timeout: 5000 });
  }

  async searchCustomer(customerName: string): Promise<void> {
    await this.searchCustomerInput().fill(customerName);
    await this.page.waitForTimeout(800);
  }

  async selectCustomerFromDropdown(customerName: string): Promise<void> {
    await this.customerDropdownOption(customerName).waitFor({ state: 'visible', timeout: 5000 });
    await this.customerDropdownOption(customerName).click();
  }

  async selectProduct(productText: string): Promise<void> {
    const select = this.productSelect();
    await select.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);

    await select.waitFor({ state: 'visible' });
    await select.click();
    await select.selectOption({ label: productText });
  }

  async fillNotes(notes: string): Promise<void> {
    await this.notesTextarea().fill(notes);
  }

  async clickCreateOrder(): Promise<void> {
    await this.createOrderButton().click();
  }
}
