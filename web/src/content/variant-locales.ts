import { getScentLabel } from "./scent-choices";
import { translateAddOn } from "./product-addons";

export type VariantLocale = "pt" | "en" | "fr";

const QUANTITY_PREFIX: Record<VariantLocale, string> = { pt: "quantidade: ", en: "quantity: ", fr: "quantité : " };

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
    .map((part) => translatePart(part, locale))
    .join(" · ");
}

/**
 * One " · " segment of a label. Besides the plain variants above, a segment can be
 * the scent choice ("aroma: canela + laranja doce"), an oil add-on on the lip
 * balms ("+ óleo essencial de laranja doce") or the air freshener's quantity
 * ("quantidade: 3") — all stored in Portuguese in the cart and on the order.
 */
function translatePart(part: string, locale: VariantLocale): string {
  const clean = part.trim();
  const plain = copy[clean]?.[locale];
  if (plain) return plain;
  if (clean.startsWith("aroma: ")) return getScentLabel(clean, locale);
  if (clean.startsWith("quantidade: ")) return QUANTITY_PREFIX[locale] + clean.slice("quantidade: ".length);
  return translateAddOn(clean, locale) ?? part;
}
