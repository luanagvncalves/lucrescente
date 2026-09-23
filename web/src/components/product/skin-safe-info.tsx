"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

const SHAMPOO_CATEGORIES = ["champos"];

const SKIN_SAFE_TEXT =
  "os nossos champôs sólidos também podem ser usados no corpo, sem preocupações: pelos ingredientes naturais e por não terem químicos, podes disfrutar de um champô multifuncional todos os dias!";

export function SkinSafeInfo({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  if (!SHAMPOO_CATEGORIES.includes(product.category.slug)) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-moss/40 bg-paper px-5 py-2.5 font-ui text-[0.9rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest/5"
      >
        <span>seguros para a pele</span>
      </button>

      {open && (
        <div className="mt-4 rounded-2xl bg-amber-50/50 border border-amber-200/40 p-6">
          <p className="text-sm leading-relaxed text-ink/80">{SKIN_SAFE_TEXT}</p>
        </div>
      )}
    </div>
  );
}
