import { pt, type Dictionary } from "@/content/pt";

/**
 * Minimal i18n seam. Portuguese only for this build.
 * To add EN/FR later: create src/content/en.ts with the same `Dictionary` shape,
 * add it to `dictionaries`, and switch `getDictionary` on a locale param / route segment.
 */
export type Locale = "pt";
export const defaultLocale: Locale = "pt";
const dictionaries: Record<Locale, Dictionary> = { pt };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}

/** Shorthand for server + client components. */
export const t = getDictionary();
