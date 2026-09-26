"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import type { ProductLocale } from "@/content/product-locales";
import { getSkinSafeNote, isSkinSafe } from "@/content/skin-safe-locales";

/**
 * Every extra claim on a product page, in one row of boxes shaped exactly like
 * the format pills in the panel below: same height, same radius, same type.
 *
 * This replaces four components that each rendered their own differently shaped
 * control — deodorant chips, "menos água", "embalagem reutilizável", "seguros
 * para a pele" — and each sat in a different part of the page. They are one
 * kind of information, so they are now one list in one place.
 *
 * Some of them have a paragraph behind them and some do not, which is why the
 * row mixes plain boxes with buttons. That difference is deliberate: a box you
 * can open is a button and says so, a bare claim is not.
 */

/** Only solid products save the water, so only they make the claim. */
const WATER_SAVING_CATEGORIES = ["champos", "amaciadores", "sabonetes"];

/** A lipstick tube and an inhaler are not packaging we take back. */
const REUSABLE_EXCLUDED_CATEGORIES = ["batons", "inaladores"];

/**
 * `sage` is the light green the brand chose by pointing at where it already
 * appeared — a sold-out format pill, once selected — and it is defined with the
 * rest of the palette in globals.css. White on it measures 5.1:1, clearing the
 * 4.5:1 that text this size needs.
 */
const BOX =
  "inline-flex h-11 items-center rounded-full border border-sage bg-sage px-4 font-ui text-[0.92rem] font-medium text-white transition-colors";

type Disclosure = { key: string; label: string; text: string; panel: string };

export function ProductExtraInfo({ product, locale = "pt" }: { product: Product; locale?: ProductLocale }) {
  const t = getDictionary(locale);
  const [open, setOpen] = useState<string | null>(null);

  // claims with nothing behind them to read
  const claims = product.is_deodorant
    ? [t.productInfo.notAntiperspirant, t.productInfo.aluminiumFree, t.productInfo.alcoholFree, t.productInfo.customisable]
    : [];

  const disclosures: Disclosure[] = [];
  if (WATER_SAVING_CATEGORIES.includes(product.category.slug)) {
    disclosures.push({
      key: "water",
      label: t.productInfo.waterSavingLabel,
      text: t.productInfo.waterSavingText,
      panel: "border-blue-200/40 bg-blue-50/50",
    });
  }
  if (!REUSABLE_EXCLUDED_CATEGORIES.includes(product.category.slug)) {
    disclosures.push({
      key: "reusable",
      label: t.productInfo.reusableLabel,
      // a solid product travels in paper rather than a container we take back
      text: product.is_solid ? t.productInfo.paperWrappedText : t.productInfo.reusableText,
      panel: "border-green-200/40 bg-green-50/50",
    });
  }
  if (isSkinSafe(product.slug, product.category.slug)) {
    disclosures.push({
      key: "skin",
      label: t.productInfo.skinSafeLabel,
      // the shampoos say something more specific than the rest
      text: getSkinSafeNote(product.category.slug, locale) ?? t.productInfo.skinSafeText,
      panel: "border-amber-200/40 bg-amber-50/50",
    });
  }

  if (!claims.length && !disclosures.length) return null;

  const openItem = disclosures.find((d) => d.key === open) ?? null;

  return (
    <div className="mt-6">
      <ul className="flex flex-wrap gap-2">
        {claims.map((label) => (
          <li key={label}>
            <span className={BOX}>{label}</span>
          </li>
        ))}
        {disclosures.map((d) => {
          const isOpen = d.key === open;
          return (
            <li key={d.key}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`extra-${d.key}`}
                onClick={() => setOpen(isOpen ? null : d.key)}
                /*
                  An open box goes to full-strength forest, the same way a chosen
                  format pill does — with only one panel below the row, something
                  has to say which box it belongs to.
                */
                className={`${BOX} cursor-pointer hover:opacity-90 ${isOpen ? "!border-forest !bg-forest" : ""}`}
              >
                {d.label}
              </button>
            </li>
          );
        })}
      </ul>

      {openItem ? (
        <div id={`extra-${openItem.key}`} className={`mt-4 rounded-2xl border p-6 ${openItem.panel}`}>
          <p className="text-sm leading-relaxed text-ink/80">{openItem.text}</p>
        </div>
      ) : null}
    </div>
  );
}
