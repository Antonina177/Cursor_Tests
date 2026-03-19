import { API_ENDPOINTS } from '../constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InventoryPayload {
  quantity: number;
  skuId: number;
  locationId: number;
}

interface InventoryItem {
  barcode: string;
  [key: string]: unknown;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Generates inventory items via the admin API.
 * Returns a flat array of barcode strings extracted from the response.
 *
 * Payload is fixed: quantity 5, skuId 3, locationId 1.
 * Auth: Bearer token from loginAPI().
 */
export async function createInventoryAPI(token: string): Promise<string[]> {
  console.log('[INVENTORY] Generating inventory …');

  const payload: InventoryPayload = {
    quantity:   5,
    skuId:      3,
    locationId: 1,
  };

  const response = await fetch(API_ENDPOINTS.createInventory, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`[INVENTORY] Create inventory failed (${response.status}): ${body}`);
  }

  const body = (await response.json()) as InventoryItem[] | { barcodes: string[] } | InventoryItem;

  // Normalise the response shape — handle all known variants:
  //   • string[]                     – plain array of barcode strings
  //   • { barcode: string }[]        – array of objects with a barcode field
  //   • { barcodes: string[] }       – object with a barcodes array
  //   • { barcode: string }          – single object
  let barcodes: string[];

  if (Array.isArray(body)) {
    if (body.length === 0) {
      barcodes = [];
    } else if (typeof body[0] === 'string') {
      // plain string array — most common case
      barcodes = body as unknown as string[];
    } else {
      // array of objects — extract barcode field from each
      barcodes = (body as InventoryItem[]).map((item) => item.barcode);
    }
  } else if ('barcodes' in body && Array.isArray(body.barcodes)) {
    barcodes = body.barcodes;
  } else if ('barcode' in body && typeof body.barcode === 'string') {
    barcodes = [body.barcode];
  } else {
    throw new Error(`[INVENTORY] Unexpected response shape: ${JSON.stringify(body)}`);
  }

  console.log(`[INVENTORY] ${barcodes.length} barcode(s) generated: ${barcodes.join(', ')}`);
  return barcodes;
}
