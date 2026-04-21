import { Page } from '@playwright/test';

export class CreateOrderModal {
  readonly page: Page;

  readonly modal = () =>
    this.page.locator('.fixed.inset-0').filter({ has: this.page.getByText('Create Regular Order') });

  // Backdrop modal — shown after customer selection (ship/product/quantity steps)
  private backdropModal = () =>
    this.page.locator('.fixed.inset-0.bg-black.bg-opacity-50.backdrop-blur-sm');

  readonly searchCustomerInput = () =>
    this.page.locator("//input[@placeholder='Type to search customers...']").first();

  readonly customerDropdownOption = (customerName: string) =>
    this.page.locator('.fixed.inset-0 button').filter({ hasText: customerName }).first();

  // Green "Ship" button inside the backdrop modal
  readonly shipButton = () =>
    this.backdropModal().getByRole('button', { name: /ship/i });

  // Product combobox input (Product 1 field)
  readonly productSelect = () =>
    this.page.locator("//input[@placeholder='Search products...']/parent::*");

  // Quantity number input inside the backdrop modal (spinbutton = type="number")
  readonly quantityInput = () =>
    this.backdropModal().getByRole('spinbutton');

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
    // Click the Product 1 * field — dropdown opens without typing
    const input = this.productSelect();
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.scrollIntoViewIfNeeded();
    await input.click();
    // Scope the search to the product field container (parent of label + input)
    const productSection = this.page.locator(
      'xpath=/html/body/div/div[1]/main/div/div[6]/div/form/fieldset/div[4]/div[2]/div/div/div[1]'
    );
    await productSection.waitFor({ state: 'visible', timeout: 10000 });
    const option = productSection.getByText('Combination Kit: TruAge + TruHealth').first();
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
  }

  async fillNotes(notes: string): Promise<void> {
    await this.notesTextarea().fill(notes);
  }

  async clickCreateOrder(): Promise<void> {
    await this.createOrderButton().click();
  }
}
