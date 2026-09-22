import type { ProductLocale } from "./product-locales";

/**
 * Extra "which hair/scalp type is this for" note shown below the product
 * photo, for the 5 solid shampoo products only, as a recommended/not
 * recommended list. Facts from Jonas (2026-09): all shampoos are fine on
 * dyed/relaxed hair; none are recommended on bleached hair (no
 * anti-yellowing/purple-toning effect); the neutral/children's one is the
 * one recommended for ultra-sensitive skin, since it has no oils in the
 * formula.
 */
export type ShampooNote = { good: string[]; bad: string[] };

const sharedGood: Record<ProductLocale, string[]> = {
  pt: ["cabelo pintado", "cabelo com alisamento"],
  en: ["dyed hair", "relaxed or straightened hair"],
  fr: ["cheveux colorés", "cheveux lissés"],
};
const sharedBad: Record<ProductLocale, string[]> = {
  pt: ["cabelo descolorado — não tem efeito anti-amarelamento"],
  en: ["bleached hair — no anti-yellowing (purple-toning) effect"],
  fr: ["cheveux décolorés — pas d'effet anti-jaunissement"],
};
const neutroExtraGood: Record<ProductLocale, string> = {
  pt: "peles e couro cabeludo ultrassensíveis — não leva óleos na fórmula",
  en: "ultra-sensitive skin and scalps — no oils in the formula",
  fr: "peaux et cuirs chevelus ultrasensibles — sans huiles dans la formule",
};

const shared: Record<ProductLocale, ShampooNote> = {
  pt: { good: sharedGood.pt, bad: sharedBad.pt },
  en: { good: sharedGood.en, bad: sharedBad.en },
  fr: { good: sharedGood.fr, bad: sharedBad.fr },
};

const notes: Record<string, Record<ProductLocale, ShampooNote>> = {
  "champo-oleosos": shared,
  "champo-secos": shared,
  "champos-para-cabelos-normais": shared,
  "champo-queda": shared,
  "champo-neutro-para-criancas": {
    pt: { good: [...sharedGood.pt, neutroExtraGood.pt], bad: sharedBad.pt },
    en: { good: [...sharedGood.en, neutroExtraGood.en], bad: sharedBad.en },
    fr: { good: [...sharedGood.fr, neutroExtraGood.fr], bad: sharedBad.fr },
  },
};

export function getShampooNote(slug: string, locale: ProductLocale): ShampooNote | null {
  return notes[slug]?.[locale] ?? null;
}
