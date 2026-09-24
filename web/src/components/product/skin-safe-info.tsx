"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import type { ProductLocale } from "@/content/product-locales";

const SHAMPOO_CATEGORIES = ["champos"];

export function SkinSafeInfo({ product, locale = "pt" }: { product: Product; locale?: ProductLocale }) {
  const [open, setOpen] = useState(false);
  const t = getDictionary(locale);

  if (!SHAMPOO_CATEGORIES.includes(product.category.slug)) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-moss/40 bg-paper px-5 py-2.5 font-ui text-[0.9rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest/5"
      >
        <span>{t.productInfo.skinSafeLabel}</span>
      </button>

      {open && (
        <div className="mt-4 rounded-2xl bg-amber-50/50 border border-amber-200/40 p-6">
          <p className="text-sm leading-relaxed text-ink/80">{t.productInfo.skinSafeText}</p>
        </div>
      )}
    </div>
  );
}
