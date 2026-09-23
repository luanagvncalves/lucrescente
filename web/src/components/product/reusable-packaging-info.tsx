"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

// Categories that don't need reusable packaging button
const EXCLUDED_CATEGORIES = ["batons", "inaladores"];

const REUSABLE_TEXT =
  "todas as nossas embalagens são reutilizáveis. se tiveres uma embalagem antiga nossa ou de outra marca, entrega-nos e aproveita do nosso desconto de reutilização na tua próxima encomenda!";

const PAPER_WRAPPED_TEXT =
  "embrulhamos todos os produtos em papel reutilizado, porque prioritizamos a sustentabilidade e a produção consciente face ao consumo desnecessário.";

export function ReusablePackagingInfo({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  // Don't show button for excluded categories
  if (EXCLUDED_CATEGORIES.includes(product.category.slug)) {
    return null;
  }

  // Determine which text to show based on whether product is solid
  const text = product.is_solid ? PAPER_WRAPPED_TEXT : REUSABLE_TEXT;

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-moss/40 bg-paper px-5 py-2.5 font-ui text-[0.9rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest/5"
      >
        <span>reutilizável</span>
      </button>

      {open && (
        <div className="mt-4 rounded-2xl bg-green-50/50 border border-green-200/40 p-6">
          <p className="text-sm leading-relaxed text-ink/80">{text}</p>
        </div>
      )}
    </div>
  );
}
