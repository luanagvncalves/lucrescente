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
  "alcool-96": {
    pt: "contém álcool a 96% — é inflamável, por isso guarda-o longe de chamas, e evita o contacto com os olhos e com pele ferida ou muito sensível, onde pode ressecar ou arder.",
    en: "contains 96% alcohol — it is flammable, so keep it away from flame, and avoid contact with the eyes and with broken or very sensitive skin, where it can dry or sting.",
    fr: "contient de l'alcool à 96 % — il est inflammable, gardez-le donc à l'écart des flammes, et évitez le contact avec les yeux et avec une peau lésée ou très sensible, où il peut dessécher ou picoter.",
  },
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
  "oleo-essencial-de-canfora": {
    pt: "contém óleo essencial de cânfora — não o apliques em bebés e crianças pequenas, nem perto do nariz e dos olhos, e evita-o durante a gravidez e a amamentação.",
    en: "contains camphor essential oil — do not apply it to babies or young children, or near the nose and eyes, and avoid it during pregnancy and breastfeeding.",
    fr: "contient de l'huile essentielle de camphre — ne l'appliquez pas sur les bébés et les jeunes enfants, ni près du nez et des yeux, et évitez-la pendant la grossesse et l'allaitement.",
  },
  "oleo-vegetal-de-amendoas-doces": {
    pt: "contém óleo de amêndoas doces — se tens alergia a frutos de casca rija, fala connosco e adaptamos a fórmula com outro óleo de base.",
    en: "contains sweet almond oil — if you have a tree-nut allergy, talk to us and we will adapt the formula with a different base oil.",
    fr: "contient de l'huile d'amande douce — en cas d'allergie aux fruits à coque, parlez-nous-en et nous adapterons la formule avec une autre huile de base.",
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
