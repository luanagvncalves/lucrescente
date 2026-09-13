"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { t } from "@/lib/i18n";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { Modal } from "@/components/ui/modal";
import { Crescent } from "@/components/ui/motifs";

export function Catalogue({ categories, products }: { categories: Category[]; products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = params.get("categoria");
  const [cancelled, setCancelled] = useState(params.get("checkout") === "cancelado");
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.get("checkout") === "cancelado") {
      const next = new URLSearchParams(params.toString());
      next.delete("checkout");
      router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function select(slug: string | null) {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("categoria", slug);
    else next.delete("categoria");
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  }

  const visible = useMemo(() => (active ? products.filter((p) => p.category.slug === active) : products), [active, products]);
  const grouped = useMemo(() => {
    const cats = active ? categories.filter((c) => c.slug === active) : categories;
    return cats.map((c) => ({ category: c, items: visible.filter((p) => p.category.slug === c.slug) })).filter((g) => g.items.length > 0 || Boolean(active));
  }, [active, categories, visible]);

  const chip = (isActive: boolean) =>
    `inline-flex h-11 items-center rounded-full border px-4 font-ui text-[0.9rem] font-medium lowercase transition-colors ${
      isActive ? "border-forest bg-forest text-white" : "border-moss/40 text-forest hover:border-forest"
    }`;

  return (
    <>
      <nav aria-label={t.products.filterLabel} className="sticky top-[72px] z-30 -mx-5 mt-10 bg-ivory/95 px-5 py-3 backdrop-blur-sm md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <button type="button" className={chip(!active)} aria-pressed={!active} onClick={() => select(null)}>
            {t.products.allCategories}
          </button>
          {categories.map((c) => (
            <button key={c.slug} type="button" className={chip(active === c.slug)} aria-pressed={active === c.slug} onClick={() => select(c.slug)}>
              {c.name}
            </button>
          ))}
        </div>
      </nav>

      <div ref={gridRef} className="mt-6 space-y-16" aria-live="polite">
        {grouped.map(({ category, items }) => (
          <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
            <div className="mb-6 flex items-baseline gap-4">
              <h2 id={`cat-${category.slug}`} className="text-h3 text-forest lowercase md:text-[2rem]">
                {category.name}
              </h2>
              <span className="text-[0.85rem] text-ink/60">{items.length}</span>
            </div>
            {items.length === 0 ? (
              <div className="card-brand flex items-center gap-4 p-6 text-ink/80">
                <Crescent size={18} tone="var(--violet)" />
                <p>{t.products.emptyCategory}</p>
              </div>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((p, i) => (
                  <li key={p.slug}>
                    <ProductCard product={p} priority={i < 2} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <Modal open={cancelled} onClose={() => setCancelled(false)} title={t.cart.errorTitle} primaryLabel={t.cart.ok}>
        {t.cart.cancelled}
      </Modal>
    </>
  );
}
