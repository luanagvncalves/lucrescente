"use client";

import { useEffect } from "react";
import { en } from "@/content/en";
import { fr } from "@/content/fr";
import { pt } from "@/content/pt";
import type { ProductLocale } from "@/content/product-locales";

// Product names are rendered server-side from @/content/product-locales — patching them
// here as well raced React's hydration and made it discard the tree.

function collectStrings(value: unknown, output: Map<string, string>) {
  if (typeof value === "string") {
    if (value.trim()) output.set(value.trim(), value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, output));
    return;
  }
  if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, output));
}

function translations(locale: ProductLocale) {
  const source = new Map<string, string>();
  const target = new Map<string, string>();
  collectStrings(pt, source);
  collectStrings(locale === "en" ? en : fr, target);
  const pairs = new Map<string, string>();
  source.forEach((portuguese) => {
    const translated = target.get(portuguese);
    if (translated && translated !== portuguese) pairs.set(portuguese, translated);
  });
  return pairs;
}

export function LocaleRuntime() {
  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("idioma");
    const locale: ProductLocale = selected === "en" || selected === "fr" ? selected : "pt";
    document.documentElement.lang = locale === "pt" ? "pt-PT" : locale === "en" ? "en-GB" : "fr-FR";
    if (locale === "pt") return;

    const pairs = translations(locale);
    const translate = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      let node: Node | null;
      while ((node = walker.nextNode())) nodes.push(node as Text);
      nodes.forEach((textNode) => {
        const value = textNode.nodeValue ?? "";
        const translated = pairs.get(value.trim());
        if (translated) textNode.nodeValue = value.replace(value.trim(), translated);
      });
    };

    translate();
    const observer = new MutationObserver(translate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
