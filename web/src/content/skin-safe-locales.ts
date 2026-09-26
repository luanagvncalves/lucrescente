import type { ProductLocale } from "./product-locales";

/**
 * Which products the brand says may go straight onto skin, and what to say
 * about each kind.
 *
 * This lives beside `allergen-notes.ts` rather than in the main dictionary for
 * the same reason that file does: it is a per-product fact, not a UI string, and
 * the list changes as the catalogue does.
 *
 * The shampoos keep their own wording — the dictionary's `skinSafeText`, which
 * makes the specific point that a solid shampoo doubles as a body wash. Every
 * other product on the list gets the general note below, because "you can use
 * this on your skin" is all there is to say about a lipstick or a soap.
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

/** The shampoos say something more specific, kept in the dictionary. */
const SHAMPOO_CATEGORIES = ["champos"];

const GENERAL_NOTE: Record<ProductLocale, string> = {
  pt: "este produto pode ser usado diretamente na pele. escolhemos cada ingrediente a pensar nisso, por isso não tens de te preocupar com o contacto direto — só com a tua própria pele, como sempre: se for sensível, experimenta primeiro numa zona pequena.",
  en: "this product can be used directly on skin. we choose every ingredient with that in mind, so direct contact is nothing to worry about — beyond your own skin, as always: if it is sensitive, try a small patch first.",
  fr: "ce produit peut être utilisé directement sur la peau. nous choisissons chaque ingrédient dans cette optique, le contact direct n'est donc pas un souci — hormis votre propre peau, comme toujours : si elle est sensible, faites d'abord un essai sur une petite zone.",
};

export function isSkinSafe(productSlug: string, categorySlug: string): boolean {
  if (NOT_SKIN_SAFE_PRODUCTS.includes(productSlug)) return false;
  return SKIN_SAFE_CATEGORIES.includes(categorySlug) || SKIN_SAFE_PRODUCTS.includes(productSlug);
}

/** `null` means "use the dictionary's shampoo wording instead". */
export function getSkinSafeNote(categorySlug: string, locale: ProductLocale): string | null {
  if (SHAMPOO_CATEGORIES.includes(categorySlug)) return null;
  return GENERAL_NOTE[locale];
}
