import type { ProductLocale } from "./product-locales";

/**
 * Plural tile labels for the homepage category grid, for the handful of
 * tiles backed by a single specific product (rather than a whole DB
 * category) — e.g. "amaciador" is one SKU, but reads as a category of its
 * own next to "champôs"/"sabonetes", so the tile shows the plural form.
 * The product's own detail page keeps its real (singular) name.
 */
const labels: Record<string, Record<ProductLocale, string>> = {
  amaciador: { pt: "amaciadores", en: "conditioners", fr: "après-shampoings" },
  "mascara-150ml": { pt: "máscaras capilares", en: "hair masks", fr: "masques capillaires" },
  inalador: { pt: "inaladores", en: "inhalers", fr: "inhalateurs" },
  ambientador: { pt: "ambientadores", en: "air fresheners", fr: "parfums d'ambiance" },
};

export function getHomeTileLabel(slug: string, locale: ProductLocale, fallback: string): string {
  return labels[slug]?.[locale] ?? fallback;
}
