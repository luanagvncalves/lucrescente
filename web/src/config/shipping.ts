/**
 * SHIPPING RATES — the one place to change them.
 * Amounts in cents (EUR). Stripe Checkout shows these as selectable shipping options.
 *
 * ⚠️ THESE NUMBERS ARE INVENTED. They were picked so checkout would have
 * something to work with, never confirmed against a carrier's price list, and
 * the brand has never stated a shipping price anywhere. They are here because
 * Stripe needs a value to show, not because they are right.
 *
 * So: do not repeat them anywhere a customer reads — not in the FAQ, not in
 * the footer, not in an email. They were once written into the FAQ in three
 * languages as though they were settled, which is exactly the mistake this
 * note exists to prevent. Say "calculated at checkout, according to the
 * destination" and let Stripe show the number. Once the brand confirms real
 * rates, replace these and delete this warning.
 */
export type ShippingTier = {
  id: string;
  label: string; // shown in Stripe Checkout and on the confirmation page
  amount_cents: number;
  countries: string[]; // ISO-3166 alpha-2 codes allowed for this tier
  min_days: number;
  max_days: number;
};

export const SHIPPING_TIERS: ShippingTier[] = [
  {
    id: "pt",
    label: "portugal continental e ilhas",
    amount_cents: 450,
    countries: ["PT"],
    min_days: 2,
    max_days: 5,
  },
  {
    id: "eu",
    label: "europa",
    amount_cents: 1200,
    countries: [
      "ES", "FR", "DE", "IT", "NL", "BE", "LU", "IE", "AT", "DK", "SE", "FI", "PL", "CZ", "SK",
      "HU", "SI", "HR", "RO", "BG", "GR", "EE", "LV", "LT", "MT", "CY", "GB", "CH", "NO",
    ],
    min_days: 5,
    max_days: 12,
  },
  {
    id: "world",
    label: "resto do mundo",
    amount_cents: 2200,
    countries: ["US", "CA", "BR", "AU", "NZ", "JP", "QA", "AE", "CO", "MX", "AR", "CL", "ZA"],
    min_days: 10,
    max_days: 25,
  },
];

/** Every country the shop ships to (union of tiers). Used for Stripe `shipping_address_collection`. */
export const ALLOWED_COUNTRIES = Array.from(new Set(SHIPPING_TIERS.flatMap((t) => t.countries)));

export function tierForCountry(country: string | null | undefined) {
  if (!country) return null;
  return SHIPPING_TIERS.find((t) => t.countries.includes(country.toUpperCase())) ?? null;
}
