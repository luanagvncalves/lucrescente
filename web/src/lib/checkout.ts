import { getVariantsBySkus } from "@/lib/catalog";
import { sanitiseAddOn } from "@/content/product-addons";


export type CheckoutItemInput = {
  sku: string;
  quantity: number;
  addOn?: string | null;
  /** The customer's own container, and how much to put in it. */
};

export type ValidatedLine = {
  variantId: string;
  sku: string;
  productSlug: string;
  productName: string;
  variantLabel: string | null;
  unitPriceCents: number;
  quantity: number;
  /** An extra made up when the order is packed, already checked against the
      product's own list. Never affects the price. */
  addOn: string | null;
  /** The customer brings the container. */
};

export type Adjustment = { sku: string; name: string; available: number };

/**
 * Validates a cart against live stock/prices. Prices always come from the database,
 * never from the client. Returns adjustments when quantities exceed stock (no oversell).
 */
export async function validateCart(items: CheckoutItemInput[]): Promise<
  { ok: true; lines: ValidatedLine[]; subtotalCents: number } | { ok: false; error: string; adjustments?: Adjustment[] }
> {
  const clean = items
    .filter((i) => typeof i.sku === "string" && Number.isInteger(i.quantity) && i.quantity > 0 && i.quantity <= 50)
    .slice(0, 40);
  if (clean.length === 0) return { ok: false, error: "carrinho vazio" };

  const variants = await getVariantsBySkus(clean.map((i) => i.sku));
  const lines: ValidatedLine[] = [];
  const adjustments: Adjustment[] = [];

  /*
    Stock is per sku, but a sku can now appear on more than one line: the
    coloured lip balms are made to order out of one stock, so "with orange" and
    "with peppermint" are the same sku with different add-ons. Checking each
    line against `v.stock` on its own would let two lines of two sell four
    balms out of a stock of two, so the quantities are summed per sku first and
    the whole sku is rejected together when the total does not fit.
  */
  const wantedBySku = new Map<string, number>();
  for (const item of clean) wantedBySku.set(item.sku, (wantedBySku.get(item.sku) ?? 0) + item.quantity);

  const rejected = new Set<string>();
  for (const item of clean) {
    const v = variants.find((x) => x.sku === item.sku);
    if (!v || !v.product.is_active || v.price_cents === null) {
      if (!rejected.has(item.sku)) {
        rejected.add(item.sku);
        adjustments.push({ sku: item.sku, name: v?.product.name ?? item.sku, available: 0 });
      }
      continue;
    }
    if (v.stock < (wantedBySku.get(v.sku) ?? 0)) {
      if (!rejected.has(v.sku)) {
        rejected.add(v.sku);
        adjustments.push({ sku: v.sku, name: `${v.product.name}${v.label ? ` (${v.label})` : ""}`, available: v.stock });
      }
      continue;
    }
    lines.push({
      variantId: v.id,
      sku: v.sku,
      productSlug: v.product.slug,
      productName: v.product.name,
      variantLabel: v.label,
      unitPriceCents: v.price_cents,
      quantity: item.quantity,
      addOn: sanitiseAddOn(v.product.slug, item.addOn),
    });
  }

  if (adjustments.length) return { ok: false, error: "stock ajustado", adjustments };
  return { ok: true, lines, subtotalCents: lines.reduce((a, l) => a + l.unitPriceCents * l.quantity, 0) };
}
