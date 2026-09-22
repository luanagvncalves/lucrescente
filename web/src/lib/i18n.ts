import { pt, type Dictionary } from "@/content/pt";
import { en } from "@/content/en";
import { fr } from "@/content/fr";

export type Locale = "pt" | "en" | "fr";
export const defaultLocale: Locale = "pt";
const dictionaries: Record<Locale, Dictionary> = { pt, en, fr };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale];
}

/** Shorthand for server + client components. */
export const t = getDictionary();
