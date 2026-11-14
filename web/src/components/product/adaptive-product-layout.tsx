"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

type Layout = "column" | "wide";

/** Compare the actual rendered layouts, keeping one copy of the purchase form. */
export function AdaptiveProductLayout({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const gallery = element.querySelector<HTMLElement>("[data-product-gallery]");
    const details = element.querySelector<HTMLElement>("[data-product-details]");
    const purchase = element.querySelector<HTMLElement>(".purchase-layout");
    if (!gallery || !details || !purchase) return;
    let frame = 0;
    let disposed = false;

    function measure(layout: Layout) {
      element!.dataset.purchaseLayout = layout;
      const g = gallery!.getBoundingClientRect();
      const d = details!.getBoundingClientRect();
      const p = purchase!.getBoundingClientRect();
      const bounds = element!.getBoundingClientRect();
      const leftBottom = layout === "column" ? p.bottom : g.bottom;
      // Count the unoccupied area below either column. A full-width purchase
      // card starts a new row; a column card can fill the space below the photo.
      const emptyArea = g.width * Math.max(0, d.bottom - leftBottom)
        + d.width * Math.max(0, leftBottom - d.bottom);
      // Also penalise page height: saving whitespace should save scrolling,
      // rather than selecting a much taller, narrow form for a tiny area gain.
      return emptyArea + bounds.width * bounds.height * 0.25;
    }

    function chooseLayout() {
      if (disposed) return;
      if (!window.matchMedia("(min-width: 768px)").matches) {
        element!.dataset.purchaseLayout = "column";
        element!.dataset.layoutReady = "true";
        return;
      }
      const columnScore = measure("column");
      const wideScore = measure("wide");
      element!.dataset.purchaseLayout = wideScore < columnScore ? "wide" : "column";
      element!.dataset.layoutReady = "true";
    }

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(chooseLayout);
    }

    chooseLayout();
    const observer = new ResizeObserver(schedule);
    for (const target of [element, gallery, details, purchase]) observer.observe(target);
    // Fonts, translations, option changes and expanding freshener groups can
    // all change which arrangement fits, without replacing or resetting inputs.
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <div ref={root} className="adaptive-product-layout mt-6" data-purchase-layout="column">{children}</div>;
}
