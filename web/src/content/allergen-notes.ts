import type { ProductLocale } from "./product-locales";

/**
 * Ingredient-driven caution notes: shown under "ingredientes principais" when
 * a product contains an ingredient with well-documented irritation/allergy
 * potential. This is a disclosure/caution, not a treatment claim — the
 * opposite direction from the medical-claim risk flagged elsewhere
 * (see the Lucrescente project memory) — so it's safe to be direct here.
 */
const GENERIC_ESSENTIAL_OIL_NOTE: Record<ProductLocale, string> = {
  pt: "este produto contém óleos essenciais, que podem causar irritação ou reações alérgicas em peles mais sensíveis.",
  en: "this product contains essential oils, which can cause irritation or allergic reactions on more sensitive skin.",
  fr: "ce produit contient des huiles essentielles, qui peuvent provoquer une irritation ou une réaction allergique sur les peaux plus sensibles.",
};

/** Specific ingredient-slug callouts, beyond the generic essential-oil note. */
const INGREDIENT_NOTES: Record<string, Record<ProductLocale, string>> = {
  "bicarbonato-de-sodio": {
    pt: "contém bicarbonato de sódio, que nalgumas peles pode causar irritação na zona das axilas, especialmente depois de depilação recente.",
    en: "contains sodium bicarbonate, which on some skin can cause irritation around the underarms, especially shortly after hair removal.",
    fr: "contient du bicarbonate de soude, qui peut irriter la peau des aisselles chez certaines personnes, surtout après une épilation récente.",
  },
  "oleo-essencial-de-canela": {
    pt: "contém óleo essencial de canela, um dos óleos essenciais com maior probabilidade de causar irritação — usa sempre diluído e evita zonas de pele mais fina.",
    en: "contains cinnamon essential oil, one of the essential oils most likely to cause irritation — always use diluted and avoid thinner-skinned areas.",
    fr: "contient de l'huile essentielle de cannelle, l'une des huiles essentielles les plus susceptibles de provoquer une irritation — utilisez-la toujours diluée et évitez les zones de peau plus fine.",
  },
  "oleo-essencial-de-bergamota": {
    pt: "contém óleo essencial de bergamota, que pode ser fotossensibilizante — evita a exposição solar direta na zona de aplicação nas horas seguintes.",
    en: "contains bergamot essential oil, which can be photosensitising — avoid direct sun exposure on the applied area for the next few hours.",
    fr: "contient de l'huile essentielle de bergamote, qui peut être photosensibilisante — évitez l'exposition directe au soleil sur la zone d'application dans les heures qui suivent.",
  },
  "oleo-essencial-de-laranja-doce": {
    pt: "contém óleo essencial de laranja doce, um óleo cítrico que pode ser levemente fotossensibilizante — evita a exposição solar direta na zona de aplicação nas horas seguintes.",
    en: "contains sweet orange essential oil, a citrus oil that can be mildly photosensitising — avoid direct sun exposure on the applied area for the next few hours.",
    fr: "contient de l'huile essentielle d'orange douce, une huile d'agrume légèrement photosensibilisante — évitez l'exposition directe au soleil sur la zone d'application dans les heures qui suivent.",
  },
  "oleo-essencial-de-limao": {
    pt: "contém óleo essencial de limão, um óleo cítrico que pode ser fotossensibilizante — evita a exposição solar direta na zona de aplicação nas horas seguintes.",
    en: "contains lemon essential oil, a citrus oil that can be photosensitising — avoid direct sun exposure on the applied area for the next few hours.",
    fr: "contient de l'huile essentielle de citron, une huile d'agrume photosensibilisante — évitez l'exposition directe au soleil sur la zone d'application dans les heures qui suivent.",
  },
};

export function getAllergenNote(ingredientSlugs: string[], locale: ProductLocale): string | null {
  const notes: string[] = [];
  if (ingredientSlugs.some((s) => s.startsWith("oleo-essencial-de-"))) {
    notes.push(GENERIC_ESSENTIAL_OIL_NOTE[locale]);
  }
  for (const slug of ingredientSlugs) {
    const note = INGREDIENT_NOTES[slug]?.[locale];
    if (note) notes.push(note);
  }
  return notes.length ? notes.join(" ") : null;
}
