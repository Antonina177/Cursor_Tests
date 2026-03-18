import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { SidebarComponent } from '../components/sidebar.component';
import { OrdersPage } from '../pages/orders.page';
import { CreateOrderModal } from '../pages/createOrder.modal';
import { TEST_USERNAME, TEST_PASSWORD, URLS, CUSTOMER_SEARCH } from '../helpers/constants';

// Test-specific constants
const PRODUCT_NAME = 'TruHealth (TruHealth)';
const ORDER_NOTES = 'Automation';

test.describe('Create Order E2E', () => {
  test('complete create order flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const sidebar = new SidebarComponent(page);
    const ordersPage = new OrdersPage(page);
    const createOrderModal = new CreateOrderModal(page);

    // Step 1: Open the login page
    await loginPage.goto();
    await expect(page).toHaveURL(/sign-in/);

    // Step 2: Login using the credentials
    await loginPage.loginAndWaitForNavigation(TEST_USERNAME, TEST_PASSWORD);
    await expect(page).not.toHaveURL(/sign-in/);

    // Step 3: In the sidebar open the "Orders" dropdown
    await sidebar.ordersDropdown().waitFor({ state: 'visible', timeout: 10000 });
    await sidebar.openOrdersDropdown();

    // Step 4: Click the "Orders" page link
    await sidebar.ordersPageLink().waitFor({ state: 'visible', timeout: 5000 });
    await sidebar.goToOrdersPage();

    await page.waitForURL(/\/orders/, { timeout: 10000 });
    await expect(page).toHaveURL(/orders/);

    // Step 5: Click the "Create order" button
    await ordersPage.createOrderButton().waitFor({ state: 'visible', timeout: 10000 });
    await ordersPage.clickCreateOrder();

    // Step 6: Assert that the "Create Regular Order" modal popup appears
    await createOrderModal.waitForModal();
    await expect(createOrderModal.createRegularOrderModalTitle()).toBeVisible();

    // Step 7: In the "Search Customer" field search for the environment customer
    await createOrderModal.searchCustomerInput().waitFor({ state: 'visible', timeout: 5000 });
    await createOrderModal.searchCustomer(CUSTOMER_SEARCH);

    // Step 8: Select the customer from the dropdown results
    await createOrderModal.selectCustomerFromDropdown(CUSTOMER_SEARCH);

    // Step 9 & 10: In the "Product Information" section, select "TruHealth (TruHealth)" from the product dropdown
    await createOrderModal.productSelect().waitFor({ state: 'visible', timeout: 5000 });
    await createOrderModal.selectProduct(PRODUCT_NAME);

    // Step 11: Enter "Automation" into the Notes textarea
    await createOrderModal.notesTextarea().waitFor({ state: 'visible', timeout: 5000 });
    await createOrderModal.fillNotes(ORDER_NOTES);

    // Step 12: Click the "Create order" button in the modal
    await createOrderModal.clickCreateOrder();

    await createOrderModal.modal().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});

    // Step 13: Navigate to orders list page
    await page.goto(URLS.ordersList);
    await page.waitForLoadState('domcontentloaded');

    // Step 14: Assert that the orders list is visible
    await expect(page).toHaveURL(/orders\/list/);
    const ordersList = page.locator('table tbody, tbody');
    await expect(ordersList).toBeVisible({ timeout: 10000 });

    // Step 15: Find the clickable element in the 1st row that contains "Order-" text and click it
    const firstRow = page.locator('table tbody tr, tbody tr').first();
    await expect(firstRow).toBeVisible({ timeout: 10000 });

    const clickableElement = firstRow.locator('a, button, [role="button"], [role="link"]').filter({ hasText: /Order-/ }).first();
    await clickableElement.waitFor({ state: 'visible', timeout: 5000 });
    await clickableElement.click();
  });
});
