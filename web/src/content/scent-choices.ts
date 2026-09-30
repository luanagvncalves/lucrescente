import type { ProductLocale } from "./product-locales";

/**
 * The scent a customer picks for the products that are made to order around an
 * essential oil: the air freshener and the candles that are not a fixed recipe.
 *
 * Up to two oils per candle or air freshener, chosen one by one or from the
 * pairs the brand already makes (cinnamon and sweet orange, palmarosa and
 * lavender, eucalyptus and lemon). It is carried to the order the same way the
 * coloured lip balms' oil is (see product-addons.ts): the browser sends a
 * string, the server keeps it only if every oil in it is on the list below and
 * there are no more than two. It can never touch the price.
 *
 * The canonical value is Portuguese, "aroma: canela + laranja doce", because
 * that is what the person packing the order reads.
 */
export type Scent = {
  /** canonical Portuguese name, the one stored in the order */
  value: string;
  label: Record<ProductLocale, string>;
  /** the ingredient page for this oil */
  ingredient: string;
};

/** Oils the customer adds, on top of any oil the product always carries. */
export const MAX_SCENTS = 2;

/** An oil that is always in the product and cannot be taken out: the citronella candle is a citronella candle. */
export const FIXED_SCENTS: Record<string, string[]> = { "vela-citronela": ["citronela"] };

/** What the picker starts on: the citronella candle's usual recipe, with lavender and eucalyptus. */
export const DEFAULT_SCENTS: Record<string, string[]> = { "vela-citronela": ["lavanda", "eucalipto"] };

/** Oils a product does not offer. Cinnamon is rough on skin, so the massage candle leaves it out. */
export const EXCLUDED_SCENTS: Record<string, string[]> = { "vela-massagem": ["canela"] };

/** The oils a product offers to choose from, and the pairs it offers. */
export function scentsFor(slug: string): Scent[] {
  const skip = new Set([...(EXCLUDED_SCENTS[slug] ?? []), ...(FIXED_SCENTS[slug] ?? [])]);
  return SCENTS.filter((s) => !skip.has(s.value));
}
export function combosFor(slug: string): string[][] {
  const skip = new Set(EXCLUDED_SCENTS[slug] ?? []);
  return SCENT_COMBOS.filter((c) => !c.some((n) => skip.has(n)));
}

/** The products that offer the picker. */
const SCENT_PRODUCTS = new Set([
  "ambientador",
  "vela-citronela",
  "vela-decorada",
  "vela-colorida",
  "vela-com-mensagem",
  "vela-massagem",
]);

export const SCENTS: Scent[] = [
  { value: "alecrim", label: { pt: "alecrim", en: "rosemary", fr: "romarin" }, ingredient: "oleo-essencial-de-alecrim" },
  { value: "bergamota", label: { pt: "bergamota", en: "bergamot", fr: "bergamote" }, ingredient: "oleo-essencial-de-bergamota" },
  { value: "camomila romana", label: { pt: "camomila romana", en: "roman chamomile", fr: "camomille romaine" }, ingredient: "oleo-essencial-de-camomila-romana" },
  { value: "canela", label: { pt: "canela", en: "cinnamon", fr: "cannelle" }, ingredient: "oleo-essencial-de-canela" },
  { value: "citronela", label: { pt: "citronela", en: "citronella", fr: "citronnelle" }, ingredient: "oleo-essencial-de-citronela" },
  { value: "erva-príncipe", label: { pt: "erva-príncipe", en: "lemongrass", fr: "lemongrass" }, ingredient: "oleo-essencial-de-erva-principe" },
  { value: "eucalipto", label: { pt: "eucalipto", en: "eucalyptus", fr: "eucalyptus" }, ingredient: "oleo-essencial-de-eucalipto-radiata" },
  { value: "gengibre", label: { pt: "gengibre", en: "ginger", fr: "gingembre" }, ingredient: "oleo-essencial-de-gengibre" },
  { value: "gerânio rosa", label: { pt: "gerânio rosa", en: "rose geranium", fr: "géranium rosat" }, ingredient: "oleo-essencial-de-geranio-rosa" },
  { value: "ho wood", label: { pt: "ho wood", en: "ho wood", fr: "ho wood" }, ingredient: "oleo-essencial-de-ho-wood" },
  { value: "hortelã-pimenta", label: { pt: "hortelã-pimenta", en: "peppermint", fr: "menthe poivrée" }, ingredient: "oleo-essencial-de-hortela-pimenta" },
  { value: "laranja doce", label: { pt: "laranja doce", en: "sweet orange", fr: "orange douce" }, ingredient: "oleo-essencial-de-laranja-doce" },
  { value: "lavanda", label: { pt: "lavanda", en: "lavender", fr: "lavande" }, ingredient: "oleo-essencial-de-lavanda" },
  { value: "limão", label: { pt: "limão", en: "lemon", fr: "citron" }, ingredient: "oleo-essencial-de-limao" },
  { value: "palmarosa", label: { pt: "palmarosa", en: "palmarosa", fr: "palmarosa" }, ingredient: "oleo-essencial-de-palmarosa" },
  { value: "patchouli", label: { pt: "patchouli", en: "patchouli", fr: "patchouli" }, ingredient: "oleo-essencial-de-patchouli" },
  { value: "petitgrain", label: { pt: "petitgrain", en: "petitgrain", fr: "petitgrain" }, ingredient: "oleo-essencial-de-petitgrain" },
  { value: "ravintsara", label: { pt: "ravintsara", en: "ravintsara", fr: "ravintsara" }, ingredient: "oleo-essencial-de-ravintsara" },
  { value: "tea tree", label: { pt: "tea tree", en: "tea tree", fr: "tea tree" }, ingredient: "oleo-essencial-de-tea-tree" },
  { value: "ylang-ylang", label: { pt: "ylang-ylang", en: "ylang-ylang", fr: "ylang-ylang" }, ingredient: "oleo-essencial-de-ylang-ylang" },
];

/** The pairs the brand already makes. */
export const SCENT_COMBOS: string[][] = [
  ["canela", "laranja doce"],
  ["palmarosa", "lavanda"],
  ["eucalipto", "limão"],
];

/** Cinnamon is the one oil on the list that is rough on skin, and gets a warning when chosen. */
export const HARSH_SCENT = "canela";

const PREFIX: Record<ProductLocale, string> = { pt: "aroma", en: "scent", fr: "parfum" };
const SEPARATOR = " + ";

export function isScentProduct(slug: string): boolean {
  return SCENT_PRODUCTS.has(slug);
}

/** The ingredient slugs of every oil on the list — the product page shows the picker instead of them. */
export const SCENT_INGREDIENT_SLUGS = new Set([...SCENTS.map((s) => s.ingredient), "oleo-essencial-de-erva-principe-citratus"]);

/** "aroma: canela + laranja doce" from the chosen names, or "" when nothing is chosen. */
export function scentValue(names: string[]): string {
  return names.length ? `aroma: ${names.join(SEPARATOR)}` : "";
}

/** The value as the server will accept it: real oils, no repeats, at most two. Null otherwise. */
export function sanitiseScent(value: unknown, slug = ""): string | null {
  if (typeof value !== "string" || !value.startsWith("aroma: ")) return null;
  const names = value.slice("aroma: ".length).split(SEPARATOR);
  const fixed = FIXED_SCENTS[slug] ?? [];
  const offered = new Set([...fixed, ...scentsFor(slug).map((s) => s.value)]);
  if (names.length < 1 || names.length > fixed.length + MAX_SCENTS) return null;
  if (new Set(names).size !== names.length) return null;
  if (!names.every((n) => offered.has(n))) return null;
  if (!fixed.every((f, i) => names[i] === f)) return null; // the permanent oil is always there, and first
  return scentValue(names);
}

/** For display only — the oils in the language on screen. Unchanged if it is not one we know. */
export function getScentLabel(value: string, locale: ProductLocale): string {
  const clean = value.startsWith("aroma: ") ? value : null;
  if (!clean) return value;
  const names = clean.slice("aroma: ".length).split(SEPARATOR);
  const label = names.map((n) => SCENTS.find((s) => s.value === n)?.label[locale] ?? n);
  return `${PREFIX[locale]}: ${label.join(SEPARATOR)}`;
}
