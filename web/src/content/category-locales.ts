import type { ProductLocale } from "./product-locales";

const names: Record<string, Partial<Record<ProductLocale, string>>> = {
  desodorizantes: { en: "deodorants", fr: "déodorants" },
  champos: { en: "shampoos", fr: "shampoings" },
  "cuidado-capilar": { en: "hair care", fr: "soin des cheveux" },
  sabonetes: { en: "soaps", fr: "savons" },
  velas: { en: "candles", fr: "bougies" },
  "roll-on": { pt: "roll-ons", en: "roll-ons", fr: "roll-ons" },
  sprays: { en: "sprays", fr: "sprays" },
  "sais-de-banho": { en: "bath salts", fr: "sels de bain" },
  batons: { en: "lip balms", fr: "baumes à lèvres" },
  inaladores: { en: "inhalers", fr: "inhalateurs" },
  ambientadores: { en: "air fresheners", fr: "parfums d'ambiance" },
};

export function getCategoryName(slug: string, locale: ProductLocale, fallback: string): string {
  return names[slug]?.[locale] ?? fallback;
}
