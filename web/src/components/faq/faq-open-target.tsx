"use client";

import { useEffect } from "react";

/**
 * Opens the answer someone arrived at.
 *
 * Every extra-information box on a product page links straight to a question
 * here — /perguntas-frequentes#porque-solidos. The browser scrolls to it, but a
 * `<details>` stays shut, so the visitor would land on a heading and have to
 * click the thing they had just clicked.
 *
 * The answers stay `<details>` in the markup rather than something this file
 * builds, so without JavaScript the anchor still resolves and still scrolls —
 * it just costs one click. `scroll-mt` on the element keeps the sticky header
 * from covering the question, for the browser's own jump as well as this one.
 */
export function FaqOpenTarget() {
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const el = document.getElementById(decodeURIComponent(id));
      if (!(el instanceof HTMLDetailsElement) || el.open) return;
      el.open = true;
      // the browser already scrolled, but to a closed summary — now that the
      // answer is showing, put the question back at the top of the view
      el.scrollIntoView({ block: "start" });
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return null;
}
