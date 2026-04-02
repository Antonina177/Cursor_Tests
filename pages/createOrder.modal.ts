import { Page } from '@playwright/test';

export class CreateOrderModal {
  readonly page: Page;

  readonly modal = () =>
    this.page.locator('.fixed.inset-0').filter({ has: this.page.getByText('Create Regular Order') });

  // Backdrop modal — shown after customer selection (ship/product/quantity steps)
  private backdropModal = () =>
    this.page.locator('.fixed.inset-0.bg-black.bg-opacity-50.backdrop-blur-sm');

  readonly searchCustomerInput = () =>
    this.page.locator('.fixed.inset-0 form div:nth-child(1) input').first();

  readonly customerDropdownOption = (customerName: string) =>
    this.page.locator('.fixed.inset-0 button').filter({ hasText: customerName }).first();

  // Green "Ship" button inside the backdrop modal
  readonly shipButton = () =>
    this.backdropModal().getByRole('button', { name: /ship/i });

  // Product dropdown inside the backdrop modal
  readonly productSelect = () =>
    this.backdropModal().locator('form div:nth-child(4) div.space-y-3 div div div:nth-child(1) select');

  // Quantity input inside the backdrop modal
  readonly quantityInput = () =>
    this.backdropModal().locator('form div:nth-child(4) div.space-y-3 div div div:nth-child(2) input');

  readonly notesTextarea = () =>
    this.page.locator('xpath=/html/body/div/div[1]/main/div/div[6]/div/form/fieldset/div[6]/textarea');

  readonly createOrderButton = () =>
    this.page.locator('xpath=/html/body/div/div[1]/main/div/div[6]/div/form/div/button[2]');

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

  async clickShipButton(): Promise<void> {
    await this.shipButton().waitFor({ state: 'visible', timeout: 5_000 });
    await this.shipButton().click();
  }

  async fillQuantity(qty: number): Promise<void> {
    await this.quantityInput().waitFor({ state: 'visible', timeout: 5_000 });
    await this.quantityInput().fill(String(qty));
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
