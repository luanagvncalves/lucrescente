"use client";

import { useEffect } from "react";
import type { ProductLocale } from "@/content/product-locales";

const TAGS: Record<ProductLocale, string> = { pt: "pt-PT", en: "en-GB", fr: "fr-FR" };

/**
 * Sets `<html lang>` to the language actually being shown. The root layout
 * hardcodes `pt-PT` because a layout is never given the query string, and a
 * screen reader trusts that attribute to pick its voice — an English page
 * announced as Portuguese is read with Portuguese pronunciation.
 *
 * This used to do much more: it walked every text node in the document and
 * swapped any string matching the Portuguese dictionary for its translation,
 * with a MutationObserver re-running it forever. That was covering components
 * that read the hardcoded Portuguese dictionary — the cart, the checkout, the
 * 404 and the care page — which now read the visitor's language on the server
 * instead. Translating in the DOM meant a visible flash of Portuguese before
 * the JavaScript ran, a permanent observer over the whole page, and the risk of
 * rewriting any text that merely happened to match a dictionary string, such as
 * a product name or a line in a customer's testimonial.
 */
export function LocaleRuntime() {
  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("idioma");
    const locale: ProductLocale = selected === "en" || selected === "fr" ? selected : "pt";
    document.documentElement.lang = TAGS[locale];
  }, []);

  return null;
}
