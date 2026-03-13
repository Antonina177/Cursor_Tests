import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { randomUserData } from '../helpers/randomData';

const TEST_USERNAME = 'antonina.horbenko+myadmin@trudiagnostic.com';
const TEST_PASSWORD = 'Passw0rd!';

// Modal scope - register kit modal overlay
const modalSelector = 'div.fixed.inset-0.bg-black.bg-opacity-50';

test.describe('Register Kit - Create Patient', () => {
  test('register kit with new patient', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const modal = () => page.locator(modalSelector);

    await test.step('1. Open login page', async () => {
      await loginPage.goto();
      await expect(page).toHaveURL(/sign-in/);
    });

    await test.step('2. Fill username', async () => {
      await page.locator('#username').fill(TEST_USERNAME);
    });

    await test.step('3. Fill password', async () => {
      await page.locator('#password').fill(TEST_PASSWORD);
    });

    await test.step('4. Click Sign in button', async () => {
      await page.getByRole('button', { name: 'Sign in' }).click();
      await page.waitForURL(url => !url.pathname.includes('/sign-in'), { timeout: 10000 });
    });

    //Unregistered Kits tab

    await test.step('5. Open sidebar - navigate to Kits', async () => {
      await page.locator('#root nav div:nth-child(3) button').waitFor({ state: 'visible' });
    });

    await test.step('6. Click Kits dropdown button', async () => {
      await page.locator('#root > div.flex.h-screen > div > nav > div:nth-child(3) > button').click();
    });

    await test.step('7. Click Active Kits in dropdown', async () => {
      const activeKitsLink = page.locator('#root nav div:nth-child(3) div a').filter({ hasText: 'Active Kits' }).first();
      await activeKitsLink.waitFor({ state: 'visible' });
      await activeKitsLink.click();
      await page.waitForURL(/kits/, { timeout: 10000 });
    });

    await test.step('8. Click Unregistered Kits tab', async () => {
      const unregisteredTab = page.locator('xpath=//*[@id="root"]/div[1]/main/div/div[2]/div[1]/div/button[2]');
      await unregisteredTab.waitFor({ state: 'visible' });
      await unregisteredTab.click();
    });

    await test.step('9. Click Register button in first row', async () => {
      const registerButton = page.locator('table tbody tr').first().locator('button[title="Register"]');
      await registerButton.waitFor({ state: 'visible' });
      await registerButton.click();
    });

    await test.step('10. Expect Register Kit modal to appear', async () => {
      await expect(modal().getByRole('heading', { name: /Register Kit/i })).toBeVisible();
    });

    await test.step('11. Scroll to patient section', async () => {
      const patientSection = modal().getByRole('heading', { name: 'Does this patient already exist in the system?' });
      await patientSection.scrollIntoViewIfNeeded();
    });

    await test.step('12. Select "No, create new patient" radio', async () => {
      const newPatientRadio = page.locator('xpath=/html/body/div/div[1]/main/div/div[3]/div/div/div[2]/div[2]/div/label[2]/input');
      await newPatientRadio.waitFor({ state: 'visible' });
      await newPatientRadio.check();
    });

    await test.step('13. Click Next button', async () => {
      const nextButton = modal().locator('div.space-y-6 div.flex.justify-end button');
      await nextButton.click();
    });

    await test.step('14. Expect Register Kit - Create Patient modal title', async () => {
      await expect(modal().getByRole('heading', { name: /Register Kit - Create Patient/i })).toBeVisible();
    });

    const userData = randomUserData();

    await test.step('15. Fill patient form with random data', async () => {
      const dobInput = page.locator('xpath=/html/body/div/div[1]/main/div/div[3]/div/div/div[2]/div[2]/form/div[1]/div[4]/input');
      const formSection = modal().locator('div.space-y-6 div:nth-child(2) form');
      const grid = formSection.locator('div[class*="grid"]');

      await grid.locator('div:nth-child(1) input').fill(userData.firstName);
      await grid.locator('div:nth-child(2) input').fill(userData.lastName);
      await grid.locator('div:nth-child(3) input').fill(userData.email);

      await dobInput.click();
      await dobInput.fill(userData.dateOfBirth);
    });

    await test.step('16 & 17. Select Biological Sex: Female', async () => {
      const sexSelect = modal().locator('div.space-y-6 div:nth-child(2) form div:nth-child(5) select');
      await sexSelect.selectOption({ label: 'Female' });
    });

    await test.step('18. Click Create Patient & Assign Kit', async () => {
      const createButton = modal().getByRole('button', { name: /Create Patient & Assign Kit/i });
      await createButton.click();
    });

    await test.step('Verify success - patient created, kit assigned, no errors', async () => {
      await expect(modal()).toBeHidden({ timeout: 15000 });
    });

    await test.step('19. Click Patients button on sidebar', async () => {
      const patientsButton = page.locator('#root > div.flex.h-screen > div > nav > a:nth-child(2)');
      await patientsButton.waitFor({ state: 'visible' });
      await patientsButton.click();
      await page.waitForURL(/patients/, { timeout: 10000 });
    });

    await test.step('20. Search for the created patient', async () => {
      const searchInput = page.locator('#root > div.flex.h-screen > main > div > div.bg-white.rounded-lg.border.border-gray-200.overflow-hidden.shadow > div.p-4.border-b.border-gray-200 > input');
      await searchInput.waitFor({ state: 'visible' });
      await searchInput.fill(`${userData.firstName} ${userData.lastName}`);
      await searchInput.press('Enter');
    });

    await test.step('21. Expect and click patient link', async () => {
      const patientCell = page.locator('table tbody tr td.cursor-pointer').filter({ hasText: userData.firstName }).filter({ hasText: userData.lastName });
      await expect(patientCell).toBeVisible({ timeout: 10000 });
      await patientCell.click();
    });
  });
});

//* feature-discounts
//testbranch
