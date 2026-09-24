"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n";
import type { Product } from "@/lib/types";
import type { ProductLocale } from "@/content/product-locales";

// Categories that don't need reusable packaging button
const EXCLUDED_CATEGORIES = ["batons", "inaladores"];

export function ReusablePackagingInfo({ product, locale = "pt" }: { product: Product; locale?: ProductLocale }) {
  const [open, setOpen] = useState(false);
  const t = getDictionary(locale);

  // Don't show button for excluded categories
  if (EXCLUDED_CATEGORIES.includes(product.category.slug)) {
    return null;
  }

  // Determine which text to show based on whether product is solid
  const text = product.is_solid ? t.productInfo.paperWrappedText : t.productInfo.reusableText;

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-moss/40 bg-paper px-5 py-2.5 font-ui text-[0.9rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest/5"
      >
        <span>{t.productInfo.reusableLabel}</span>
      </button>

      {open && (
        <div className="mt-4 rounded-2xl bg-green-50/50 border border-green-200/40 p-6">
          <p className="text-sm leading-relaxed text-ink/80">{text}</p>
        </div>
      )}
    </div>
  );
}
