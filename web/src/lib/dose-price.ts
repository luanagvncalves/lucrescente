/**
 * Pricing for "embalagem própria", where the customer brings their own
 * container and says how much to fill it with.
 *
 * This rule used to live only in the purchase panel, which meant the browser
 * worked out a price, showed it, put it in the cart — and then `validateCart`
 * re-priced the line from the database and charged the plain variant price
 * instead. The customer decided on one number and was charged another, and the
 * dose they typed reached nobody: not Stripe, not the order, not the person
 * filling the container.
 *
 * So it lives here, imported by the panel and by `validateCart` both, and the
 * server's answer is the one that counts. The panel shows what the server will
 * charge because they run the same function over the same database price.
 */

/** The longest dose we will store or print. Long enough for "500 g", "1,5 L". */
export const DOSE_MAX_LENGTH = 40;

/**
 * The dose as we are willing to keep it: trimmed, collapsed, stripped of
 * control characters and cut to length. Free text — someone may write "meio
 * litro" — so this cannot be an allowlist the way an add-on can, and the
 * protection is that it only ever reaches a label.
 */
export function sanitiseDose(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const clean = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return clean ? clean.slice(0, DOSE_MAX_LENGTH) : null;
}

/**
 * The number of units in a dose, or 0 when there is no number in it.
 *
 * "500g" → 500, "1,5L" → 1.5, "meio litro" → 0. A dose with no number is kept
 * as a note on the order and priced as the plain variant, which is the honest
 * answer: we cannot compute what we cannot read.
 */
export function parseDoseAmount(dose: string | null): number {
  if (!dose) return 0;
  const match = dose.replace(",", ".").match(/\d+(?:\.\d+)?/);
  const amount = match ? Number.parseFloat(match[0]) : 0;
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

/**
 * What one unit costs at this dose. `basePriceCents` is the variant's price per
 * 100 units — 100 g, 100 ml. So the deodorant's "embalagem própria" at 10,00 €
 * means 10,00 € per 100 g, and a 500 g dose costs 50,00 €.
 *
 * That reading was inherited from the purchase panel rather than written down
 * anywhere, and it only ever showed on screen — the server charged the plain
 * variant price. Confirmed by the brand on 2026-09-28, and now it is what is
 * actually charged, so a change to it changes what customers pay.
 *
 * Returns the plain price when the dose carries no readable number, so a line
 * can never come out free or NaN.
 */
export function doseUnitPriceCents(basePriceCents: number, dose: string | null): number {
  const amount = parseDoseAmount(dose);
  if (amount <= 0) return basePriceCents;
  return Math.round((basePriceCents * amount) / 100);
}
