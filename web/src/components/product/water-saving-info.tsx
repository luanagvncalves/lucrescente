"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

const WATER_SAVING_CATEGORIES = ["champos", "amaciadores", "sabonetes"];

const WATER_SAVING_TEXT =
  "não usamos água no fabrico deste produto. os produtos sólidos deixam muito menos resíduos e soltam-se mais facilmente do cabelo e da pele, por isso não precisas de gastar tanta água para te sentires limpx, e como não necessitam de embalagens, também poupamos a água usada no fabrico de plástico.";

export function WaterSavingInfo({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  if (!WATER_SAVING_CATEGORIES.includes(product.category.slug)) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-moss/40 bg-paper px-5 py-2.5 font-ui text-[0.9rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest/5"
      >
        <span>menos água</span>
      </button>

      {open && (
        <div className="mt-4 rounded-2xl bg-blue-50/50 border border-blue-200/40 p-6">
          <p className="text-sm leading-relaxed text-ink/80">{WATER_SAVING_TEXT}</p>
        </div>
      )}
    </div>
  );
}
