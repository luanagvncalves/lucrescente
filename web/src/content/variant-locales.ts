export type VariantLocale = "pt" | "en" | "fr";

/**
 * Variant labels ("boião", "frasco de vidro", …) live in Supabase in Portuguese
 * only, and were being printed raw next to an otherwise translated product name
 * on the Stripe payment page.
 *
 * Only the labels that actually read as Portuguese are here. Units like "60ml"
 * and words English and French already share, like "stick", are deliberately
 * absent: they fall through unchanged, which also keeps them identical to what
 * the product page shows.
 */
const copy: Record<string, Partial<Record<VariantLocale, string>>> = {
  "boião": { en: "jar", fr: "pot" },
  "frasco de vidro": { en: "glass jar", fr: "flacon en verre" },
  // the optional oils on the coloured lip balms, which ride in the compound
  // label as their own segment — see content/product-addons.ts, where the same
  // wording is defined for the purchase panel and the Stripe line item
  "+ óleo de laranja doce": { en: "+ sweet orange oil", fr: "+ huile d'orange douce" },
  "+ óleo de hortelã-pimenta": { en: "+ peppermint oil", fr: "+ huile de menthe poivrée" },
};

/**
 * Translates a variant label, leaving anything untranslated exactly as it was.
 *
 * The cart builds compound labels out of " · " — a variant, sometimes "o meu
 * recipiente", sometimes a dose the customer typed. Each part is translated on
 * its own, so the known variant is converted while a dose, or a part already
 * translated when it was added, passes through untouched.
 */
export function getVariantLabel(label: string | null, locale: VariantLocale): string | null {
  if (!label) return null;
  if (locale === "pt") return label;
  return label
    .split(" · ")
    .map((part) => copy[part.trim()]?.[locale] ?? part)
    .join(" · ");
}
