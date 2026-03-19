import { API_ENDPOINTS, API_KEY } from '../constants';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderResponse {
  id: string | number;
  number?: string;
  externalId?: string;
  [key: string]: unknown;
}

interface ScanPayload {
  barcode: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Creates an order via the external order API using API key authentication.
 * Generates a unique externalId per call to avoid duplicates.
 * Returns the full order response (id used for subsequent scan calls).
 *
 * Auth: X-Api-Key header (Schema: Default in Swagger).
 */
export async function createOrderAPI(externalId: string): Promise<OrderResponse> {
  console.log(`[ORDER] Creating order with externalId: ${externalId} …`);

  const response = await fetch(API_ENDPOINTS.createOrder, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ApiKey':       API_KEY,
      'Schema':       'Default',
    },
    body: JSON.stringify({
      shippingAddress: {
        attention:    'AT',
        addressLine1: '123 Main St',
        addressLine2: '',
        city:         'Lexington',
        state:        'KY',
        postalCode:   '40503',
        country:      'USA',
        phone:        '+15551234567',
      },
      externalId,
      items: [
        {
          skuId:    'sku_9919c1894c4035f960aa9ede60716b',
          quantity: 5,
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[ORDER] Create order failed (${response.status}): ${body}`);
  }

  const body = (await response.json()) as OrderResponse;
  // Log full response so the correct ID field for the scan endpoint can be identified
  console.log(`[ORDER] Full response: ${JSON.stringify(body, null, 2)}`);
  return body;
}

/**
 * Scans a single barcode against an order.
 * Call once per barcode returned by createInventoryAPI().
 *
 * Auth: Bearer token from loginAPI().
 */
export async function scanOrderAPI(
  token: string,
  orderId: string | number,
  barcode: string,
): Promise<void> {
  console.log(`[SCAN] Scanning barcode "${barcode}" for order ${orderId} …`);

  const payload: ScanPayload = { barcode };

  const response = await fetch(API_ENDPOINTS.scanOrder(orderId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[SCAN] Scan failed for barcode "${barcode}" (${response.status}): ${body}`);
  }

  console.log(`[SCAN] Barcode "${barcode}" scanned successfully.`);
}
