/**
 * Packing the cart into Stripe session metadata.
 *
 * Stripe caps each metadata VALUE at 500 characters. The cart used to be
 * serialised — product names, variant labels and all — into a single `items`
 * value, and the webhook read that value to write the order. A cart with enough
 * lines would have pushed it past the cap, and the failure mode was the bad
 * kind: Stripe accepts the session, the customer pays, and the webhook then
 * cannot reconstruct what was bought, so a paid order is never recorded.
 *
 * Two things fix that. The names no longer travel here at all — they ride on
 * each line item's product, where Stripe stores them for us — so only compact
 * numeric triples remain. And what is left is split across numbered keys that
 * each stay under the cap, so the payload grows by key count rather than
 * bursting a single value.
 */

/** [sku, quantity, unit price in cents] */
export type CompactItem = [string, number, number];

/** Comfortably under Stripe's 500-character ceiling. */
const CHUNK = 450;
/** Stripe allows 50 keys per object; leave room for `locale` and future additions. */
const MAX_CHUNKS = 40;

export function packItems(items: CompactItem[]): Record<string, string> {
  const serialised = JSON.stringify(items);
  const out: Record<string, string> = {};
  let n = 0;
  for (let i = 0; i < serialised.length; i += CHUNK) {
    if (n >= MAX_CHUNKS) {
      // Unreachable for any cart `validateCart` permits (it caps at 40 lines,
      // ~25 characters each). Thrown rather than truncated, because a truncated
      // value would be a silently unrecordable order.
      throw new Error(`cart too large for Stripe metadata: ${serialised.length} chars`);
    }
    out[`items_${n}`] = serialised.slice(i, i + CHUNK);
    n += 1;
  }
  out.items_count = String(n);
  return out;
}

export function unpackItems(metadata: Record<string, string> | null | undefined): CompactItem[] {
  if (!metadata) return [];

  const count = Number(metadata.items_count);
  if (Number.isInteger(count) && count > 0) {
    let joined = "";
    for (let i = 0; i < count; i += 1) {
      const part = metadata[`items_${i}`];
      // A missing chunk means the array cannot be trusted; better to report
      // nothing than a cart with holes in it.
      if (part === undefined) return [];
      joined += part;
    }
    return parse(joined);
  }

  // Sessions created before the split still carry a single `items` value, and
  // Stripe keeps them retrievable for months. Those hold five-element rows.
  if (metadata.items) {
    const legacy = parse(metadata.items) as unknown as (CompactItem | [string, number, number, string, string | null])[];
    return legacy.map((row) => [row[0], row[1], row[2]] as CompactItem);
  }

  return [];
}

function parse(s: string): CompactItem[] {
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
