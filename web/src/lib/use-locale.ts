"use client";

import { useSearchParams } from "next/navigation";
import { getDictionary, type Locale } from "@/lib/i18n";

/**
 * The language lives in `?idioma=`, so a client component that wants to read it
 * has to go through `useSearchParams`. Several of them were importing the
 * ready-made `t` instead, which is the Portuguese dictionary — the cart, the
 * checkout and the 404 page stayed in Portuguese however the visitor arrived.
 *
 * `query` is the suffix every internal link needs: without it, one click drops
 * the visitor back into Portuguese.
 *
 * A component using this hook must sit under a `<Suspense>` boundary, or Next
 * refuses to render the route statically.
 */
export function useLocale(): { locale: Locale; t: ReturnType<typeof getDictionary>; query: string } {
  const idioma = useSearchParams().get("idioma");
  const locale: Locale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  return { locale, t: getDictionary(locale), query: locale === "pt" ? "" : `?idioma=${locale}` };
}
