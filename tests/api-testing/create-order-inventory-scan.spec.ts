import { test, expect } from '@playwright/test';
import { TEST_USERNAME, TEST_PASSWORD } from '../../helpers/constants';
import { generateExternalId } from '../../helpers/randomData';
import { loginAPI } from '../../helpers/api-helpers/auth.helper';
import { createOrderAPI, scanOrderAPI } from '../../helpers/api-helpers/order.helper';
import { createInventoryAPI } from '../../helpers/api-helpers/inventory.helper';

test.describe('Order – Inventory – Scan (API)', () => {
  test('should create an order, generate inventory, and scan all barcodes', async () => {

    // ── Step 1: Authenticate against the ops API ──────────────────────────────
    const token = await test.step('Authenticate and get Bearer token', async () => {
      const t = await loginAPI(TEST_USERNAME, TEST_PASSWORD);
      expect(t, 'Bearer token must be a non-empty string').toBeTruthy();
      return t;
    });

    // ── Step 2: Create Order (external API, API key auth) ─────────────────────
    const order = await test.step('Create order via external API', async () => {
      const externalId = generateExternalId();
      console.log(`[TEST] Using externalId: ${externalId}`);

      const result = await createOrderAPI(externalId);
      // Log all fields so we can identify which ID to use for the scan endpoint
      console.log(`[TEST] Order response fields: ${Object.keys(result).join(', ')}`);
      console.log(`[TEST] Order full response: ${JSON.stringify(result, null, 2)}`);

      return result;
    });

    // ── Step 3: Generate inventory barcodes (ops API, Bearer auth) ────────────
    const barcodes = await test.step('Generate inventory and extract barcodes', async () => {
      const result = await createInventoryAPI(token);
      expect(result.length, 'At least one barcode must be returned').toBeGreaterThan(0);

      console.log(`[TEST] Barcodes to scan: ${result.join(', ')}`);
      return result;
    });

    // ── Extract numeric order ID from "number" field (e.g. "Order-14120" → 14120) ──
    const numericOrderId = Number(order.number?.replace(/\D/g, ''));
    expect(numericOrderId, `Numeric order ID extracted from "${order.number}" must be > 0`).toBeGreaterThan(0);
    console.log(`[TEST] Numeric orderId for scan: ${numericOrderId}`);

    // ── Step 4: Scan each barcode individually — one request per barcode ─────
    for (let i = 0; i < barcodes.length; i++) {
      const barcode = barcodes[i];
      await test.step(`Scan barcode ${i + 1} of ${barcodes.length}: "${barcode}"`, async () => {
        await scanOrderAPI(token, numericOrderId, barcode);
      });
    }
  });
});
