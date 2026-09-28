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
  "embalagem própria": { en: "your own container", fr: "votre propre contenant" },
};

/** Translates a variant label, leaving anything untranslated exactly as it was. */
export function getVariantLabel(label: string | null, locale: VariantLocale): string | null {
  if (!label) return null;
  if (locale === "pt") return label;
  return copy[label]?.[locale] ?? label;
}
