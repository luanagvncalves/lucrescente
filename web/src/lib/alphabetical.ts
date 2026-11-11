import type { ProductLocale } from "@/content/product-locales";

/** Sort the displayed names in the visitor's language without mutating source data. */
export function alphabetical<T>(items: readonly T[], name: (item: T) => string, locale: ProductLocale): T[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base", numeric: true });
  return [...items].sort((a, b) => collator.compare(name(a), name(b)));
}
