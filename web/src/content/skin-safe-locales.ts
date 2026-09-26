/**
 * Which products the brand says may go straight onto skin.
 *
 * This lives beside `allergen-notes.ts` rather than in the main dictionary for
 * the same reason that file does: it is a per-product fact, not a UI string,
 * and the list changes as the catalogue does.
 *
 * The wording that went with it now lives in the FAQ instead — "que produtos
 * posso usar diretamente na pele?" — which is where the product page's box
 * sends people. Keep that answer's list and this one in step.
 */

/** Categories where every product may be used directly on skin. */
const SKIN_SAFE_CATEGORIES = [
  "ambientadores",
  "batons",
  "champos",
  "desodorizantes",
  "roll-on",
  "sabonetes",
  "velas",
];

/**
 * Exceptions inside those categories. The coloured candles carry pigment, which
 * the rest of the range does not, so they are not offered for skin.
 */
const NOT_SKIN_SAFE_PRODUCTS = ["vela-colorida"];

/** Skin-safe products whose category also holds products that are not. */
const SKIN_SAFE_PRODUCTS = ["spray-relaxante"];

export function isSkinSafe(productSlug: string, categorySlug: string): boolean {
  if (NOT_SKIN_SAFE_PRODUCTS.includes(productSlug)) return false;
  return SKIN_SAFE_CATEGORIES.includes(categorySlug) || SKIN_SAFE_PRODUCTS.includes(productSlug);
}
