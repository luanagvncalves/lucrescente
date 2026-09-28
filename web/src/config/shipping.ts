/**
 * SHIPPING RATES — the one place to change them.
 * Amounts in cents (EUR). Stripe Checkout shows these as selectable shipping options.
 *
 * These replace an earlier set that was invented. They are built on CTT's
 * published Lojas Online e-commerce rates (the contract plan, from €150/year),
 * rounded up to absorb packaging and the odd heavier parcel:
 *
 *   mainland  CTT charges 3,07 € up to 1kg / 3,17 € up to 2kg  → we charge 3,50 €
 *   islands   CTT charges from 9,10 €, Açores capped at 5kg    → we charge 9,50 €
 *   europe    CTT charges from 11,43 €                         → we charge 12,50 €
 *   world     CTT rises steeply by zone                        → we charge 35,00 €
 *
 * ⚠️ TWO THINGS TO KNOW BEFORE TRUSTING THESE NUMBERS.
 *
 * 1. They assume the CTT Lojas Online contract is actually signed. Without it,
 *    walk-in counter prices apply and they are far higher — 8,25 € for the same
 *    mainland parcel, 37,20 € for the same European one. If the contract lapses
 *    or was never taken, every one of these rates is sold at a loss.
 *
 * 2. The rest-of-world rate is the roughest. CTT's zones run from about 47 € to
 *    79 € at counter prices, so 35,00 € is a deliberate partial subsidy on far
 *    destinations rather than cost recovery. Revisit it if those orders stop
 *    being rare.
 *
 * Do not repeat these anywhere a customer reads — not in the FAQ, not in the
 * footer, not in an email. They were once written into the FAQ in three
 * languages as though they were settled, and then changed. Say "calculated at
 * checkout, according to the destination" and let Stripe show the number.
 */
export type ShippingLocale = "pt" | "en" | "fr";

export type ShippingTier = {
  id: string;
  /**
   * Shown in Stripe Checkout and on the confirmation page, in the language the
   * customer is buying in — Stripe prints this string as given, so a Portuguese
   * one left an English or French customer reading the only untranslated line
   * on an otherwise translated payment page.
   */
  label: Record<ShippingLocale, string>;
  amount_cents: number;
  countries: string[]; // ISO-3166 alpha-2 codes allowed for this tier
  min_days: number;
  max_days: number;
};

export const SHIPPING_TIERS: ShippingTier[] = [
  {
    id: "pt",
    label: {
      pt: "portugal continental",
      en: "mainland portugal",
      fr: "portugal continental",
    },
    amount_cents: 350,
    countries: ["PT"],
    min_days: 2,
    max_days: 5,
  },
  {
    // Madeira and the Azores cost CTT roughly three times the mainland, and used
    // to share the mainland's rate — so every island order was sold at a loss.
    // They are one country code, so Stripe cannot tell them apart from the
    // address: see the note on shipping_options in the checkout route.
    id: "pt-ilhas",
    label: {
      pt: "madeira e açores",
      en: "madeira and the azores",
      fr: "madère et les açores",
    },
    amount_cents: 950,
    countries: ["PT"],
    min_days: 5,
    max_days: 15,
  },
  {
    id: "eu",
    label: {
      pt: "europa",
      en: "europe",
      fr: "europe",
    },
    amount_cents: 1250,
    countries: [
      "ES", "FR", "DE", "IT", "NL", "BE", "LU", "IE", "AT", "DK", "SE", "FI", "PL", "CZ", "SK",
      "HU", "SI", "HR", "RO", "BG", "GR", "EE", "LV", "LT", "MT", "CY", "GB", "CH", "NO",
    ],
    min_days: 5,
    max_days: 12,
  },
  {
    id: "world",
    label: {
      pt: "resto do mundo",
      en: "rest of the world",
      fr: "reste du monde",
    },
    amount_cents: 3500,
    countries: ["US", "CA", "BR", "AU", "NZ", "JP", "QA", "AE", "CO", "MX", "AR", "CL", "ZA"],
    min_days: 10,
    max_days: 25,
  },
];

/** The tier's name in one language, falling back to Portuguese. */
export function shippingLabel(tier: ShippingTier, locale: ShippingLocale): string {
  return tier.label[locale] ?? tier.label.pt;
}

/** Every country the shop ships to (union of tiers). Used for Stripe `shipping_address_collection`. */
export const ALLOWED_COUNTRIES = Array.from(new Set(SHIPPING_TIERS.flatMap((t) => t.countries)));

/**
 * The cheapest tier serving a country. Note that "PT" matches mainland before
 * the islands, so this cannot tell a Funchal address from a Lisbon one — a
 * country code is all it has. Only the local mock checkout relies on it; the
 * real Stripe page lets the customer pick the tier themselves.
 */
export function tierForCountry(country: string | null | undefined) {
  if (!country) return null;
  return SHIPPING_TIERS.find((t) => t.countries.includes(country.toUpperCase())) ?? null;
}
