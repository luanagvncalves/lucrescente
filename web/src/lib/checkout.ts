import { getVariantsBySkus } from "@/lib/catalog";

export type CheckoutItemInput = { sku: string; quantity: number };

export type ValidatedLine = {
  variantId: string;
  sku: string;
  productSlug: string;
  productName: string;
  variantLabel: string | null;
  unitPriceCents: number;
  quantity: number;
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

  for (const item of clean) {
    const v = variants.find((x) => x.sku === item.sku);
    if (!v || !v.product.is_active || v.price_cents === null) {
      adjustments.push({ sku: item.sku, name: v?.product.name ?? item.sku, available: 0 });
      continue;
    }
    if (v.stock < item.quantity) {
      adjustments.push({ sku: v.sku, name: `${v.product.name}${v.label ? ` (${v.label})` : ""}`, available: v.stock });
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
    });
  }

  if (adjustments.length) return { ok: false, error: "stock ajustado", adjustments };
  return { ok: true, lines, subtotalCents: lines.reduce((a, l) => a + l.unitPriceCents * l.quantity, 0) };
}
