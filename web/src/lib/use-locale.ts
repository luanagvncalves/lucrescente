"use client";

import { useEffect, useState } from "react";
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

/**
 * The same thing for `not-found.tsx` and `error.tsx`.
 *
 * Next refuses to build if those two reach for `useSearchParams`, even wrapped
 * in `<Suspense>`: it prerenders them as `/404` and `/500`, which are static by
 * definition, and a component that needs the query string cannot be. The build
 * fails with "useSearchParams() should be wrapped in a suspense boundary at
 * page /404" — which it already was.
 *
 * So these read the query string from the browser after mounting instead. The
 * first paint is Portuguese and it settles on the visitor's language a moment
 * later; on an error page that is a fair trade for a build that completes.
 */
export function useLocaleAfterMount(): { locale: Locale; t: ReturnType<typeof getDictionary>; query: string } {
  const [locale, setLocale] = useState<Locale>("pt");
  useEffect(() => {
    const idioma = new URLSearchParams(window.location.search).get("idioma");
    if (idioma === "en" || idioma === "fr") setLocale(idioma);
  }, []);
  return { locale, t: getDictionary(locale), query: locale === "pt" ? "" : `?idioma=${locale}` };
}
