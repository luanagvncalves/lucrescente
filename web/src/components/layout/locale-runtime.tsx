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
  useSingleLineText();
  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("idioma");
    const locale: ProductLocale = selected === "en" || selected === "fr" ? selected : "pt";
    document.documentElement.lang = TAGS[locale];
  }, []);

  return <style>{LINE_STYLES}</style>;
}

// Fit the full sentence to its container, including the hero while it types.
// Paragraphs are excluded: only headings, labels and page/section subtitles fit.
const LINE_TARGETS = [
  "h1:not(.sr-only)", "h2:not(.sr-only)", "h3:not(.sr-only)",
  "h4:not(.sr-only)", "h5:not(.sr-only)", "h6:not(.sr-only)",
  "p.label-brand", "legend.label-brand", "[data-fit-line]",
  "main summary.font-display", "main .tile-scrim > .font-display",
  "main header > p.text-body-lg", "main h1 + p.text-body-lg",
  "main .flex.flex-col.gap-4 > p.text-body-lg",
  "#ingredientes + p.text-body-lg",
].join(", ");

const LINE_STYLES = LINE_TARGETS + ` {
  width: 100%;
  max-width: 100% !important;
  min-width: 0;
  white-space: nowrap !important;
  overflow-wrap: normal;
  word-break: normal;
}
.single-line-parent { min-width: 0; }
main header:has(> h1) { max-width: 100%; }
`;

function useSingleLineText() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let revision = 0;
    let disposed = false;
    const originals = new Map<HTMLElement, { value: string; priority: string }>();
    const fitted = new WeakMap<HTMLElement, { text: string; width: number; revision: number }>();
    const parents = new Set<Element>();
    const widths = new WeakMap<Element, number>();

    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(fitAll);
    };
    const resize = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (widths.get(entry.target) !== width) {
          widths.set(entry.target, width);
          changed = true;
        }
      }
      if (changed) schedule();
    });

    function fitAll() {
      frame = 0;
      const nextParents = new Set<Element>();
      document.querySelectorAll<HTMLElement>(LINE_TARGETS).forEach((element) => {
        const parent = element.parentElement;
        if (!parent || !element.getClientRects().length || element.closest('[hidden], [aria-hidden="true"]')) return;
        parent.classList.add("single-line-parent");
        nextParents.add(parent);
        if (!parents.has(parent)) resize.observe(parent);
        const fullTitle = element.querySelector<HTMLElement>(".sr-only");
        let text = (fullTitle?.textContent ?? element.textContent ?? "").replace(/\s+/g, " ").trim();
        if (!text) return;
        const width = element.clientWidth;
        const previous = fitted.get(element);
        if (previous?.text === text && previous.width === width && previous.revision === revision) return;
        if (!originals.has(element)) originals.set(element, {
          value: element.style.getPropertyValue("font-size"),
          priority: element.style.getPropertyPriority("font-size"),
        });
        const original = originals.get(element)!;
        if (original.value) element.style.setProperty("font-size", original.value, original.priority);
        else element.style.removeProperty("font-size");
        const style = getComputedStyle(element);
        const base = parseFloat(style.fontSize);
        let available = element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 1;
        if (element.matches("summary")) {
          const icon = element.querySelector<HTMLElement>('[aria-hidden="true"]');
          available -= (icon?.getBoundingClientRect().width ?? 0) + (parseFloat(style.columnGap) || 0);
        }
        if (available <= 0 || !Number.isFinite(base)) return;
        if (style.textTransform === "lowercase") text = text.toLocaleLowerCase(document.documentElement.lang);
        else if (style.textTransform === "uppercase") text = text.toLocaleUpperCase(document.documentElement.lang);
        context!.font = style.fontStyle + " " + style.fontWeight + " " + base + "px " + style.fontFamily;
        const spacing = (parseFloat(style.letterSpacing) || 0) * Math.max(0, Array.from(text).length - 1);
        const measured = context!.measureText(text).width + spacing;
        let size = Math.min(base, base * available / Math.max(1, measured));
        element.style.fontSize = Math.max(1, Math.floor(size * 10) / 10) + "px";
        // Account for browser shaping and inline content without clipping it.
        for (let pass = 0; pass < 2 && element.scrollWidth > element.clientWidth; pass++) {
          size *= (element.clientWidth - 1) / element.scrollWidth;
          element.style.fontSize = Math.max(1, Math.floor(size * 10) / 10) + "px";
        }
        fitted.set(element, { text: (fullTitle?.textContent ?? element.textContent ?? "").replace(/\s+/g, " ").trim(), width: element.clientWidth, revision });
      });
      parents.forEach((parent) => { if (!nextParents.has(parent)) resize.unobserve(parent); });
      parents.clear();
      nextParents.forEach((parent) => parents.add(parent));
      originals.forEach((_, element) => { if (!element.isConnected) originals.delete(element); });
    }

    const invalidate = () => { revision++; schedule(); };
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, characterData: true, subtree: true });
    window.addEventListener("resize", invalidate, { passive: true });
    document.fonts.addEventListener("loadingdone", invalidate);
    void document.fonts.ready.then(() => { if (!disposed) invalidate(); });
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize.disconnect();
      window.removeEventListener("resize", invalidate);
      document.fonts.removeEventListener("loadingdone", invalidate);
      parents.forEach((parent) => parent.classList.remove("single-line-parent"));
      originals.forEach((original, element) => {
        if (original.value) element.style.setProperty("font-size", original.value, original.priority);
        else element.style.removeProperty("font-size");
      });
    };
  }, []);
}
