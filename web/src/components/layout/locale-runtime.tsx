"use client";

import { useEffect } from "react";
import { en } from "@/content/en";
import { fr } from "@/content/fr";
import { pt } from "@/content/pt";
import type { ProductLocale } from "@/content/product-locales";

const productNames: Record<string, Record<Exclude<ProductLocale, "pt">, string>> = {
  "desodorizante-lavanda-palmarosa": { en: "lavender/palmarosa deodorant", fr: "déodorant lavande/palmarosa" },
  "desodorizante-tea-tree-erva-principe": { en: "tea tree/lemon verbena deodorant", fr: "déodorant tea tree/verveine citronnée" },
  "champo-oleosos": { en: "oily hair shampoo", fr: "shampoing cheveux gras" },
  "champo-secos": { en: "dry hair shampoo", fr: "shampoing cheveux secs" },
  "champos-para-cabelos-normais": { en: "shampoo for normal hair", fr: "shampoing cheveux normaux" },
  "champo-neutro-para-criancas": { en: "gentle shampoo for children", fr: "shampoing doux pour enfants" },
  "champo-queda": { en: "hair-loss shampoo", fr: "shampoing anti-chute" },
  amaciador: { en: "conditioner", fr: "après-shampoing" },
  "mascara-150ml": { en: "150 ml hair mask", fr: "masque capillaire 150 ml" },
  "sabonete-corpo-aveia": { en: "oat body soap", fr: "savon pour le corps à l'avoine" },
  "sabonete-40g": { en: "40 g soap", fr: "savon 40 g" },
  "sabonete-grande": { en: "large soap", fr: "grand savon" },
  "vela-citronela": { en: "citronella candle", fr: "bougie à la citronnelle" },
  "vela-massagem": { en: "massage candle", fr: "bougie de massage" },
  "roll-on-relaxamento": { en: "relaxation roll-on", fr: "roll-on relaxation" },
  "roll-on-cabeca": { en: "head roll-on", fr: "roll-on tête" },
  "roll-on-sinusite": { en: "sinus roll-on", fr: "roll-on sinus" },
  "spray-relaxante": { en: "relaxing spray", fr: "spray relaxant" },
  "sais-de-banho-relaxante": { en: "relaxing bath salts", fr: "sels de bain relaxants" },
  "batom-tijolo": { en: "brick lip balm", fr: "baume à lèvres brique" },
  "batom-herpes": { en: "cold sore balm", fr: "baume boutons de fièvre" },
  "batom-laranja": { en: "orange lip balm", fr: "baume à lèvres orange" },
  "batom-natural": { en: "natural lip balm", fr: "baume à lèvres naturel" },
  "batom-h-pimenta": { en: "peppermint lip balm", fr: "baume à lèvres menthe poivrée" },
  inalador: { en: "inhaler", fr: "inhalateur" },
  ambientador: { en: "soy wax air freshener", fr: "désodorisant à la cire de soja" },
};

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
    Object.entries(productNames).forEach(([slug, names]) => {
      const name = names[locale];
      document.querySelectorAll(`[href$="/produtos/${slug}"] h3, h1`).forEach((element) => {
        if (element.textContent?.trim() === slug) element.textContent = name;
      });
    });

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
