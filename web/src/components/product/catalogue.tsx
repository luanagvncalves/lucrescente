"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import type { Category, Product } from "@/lib/types";
import { getCategoryName } from "@/content/category-locales";
import type { ProductLocale } from "@/content/product-locales";
import { ProductCard } from "./product-card";
import { Modal } from "@/components/ui/modal";
import { Crescent } from "@/components/ui/motifs";
import { FilterBar } from "@/components/ui/filter-bar";

export function Catalogue({ categories, products }: { categories: Category[]; products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = params.get("categoria");
  const idioma = params.get("idioma");
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
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

  function select(slug: string) {
    if (slug) {
      const productsInCategory = products.filter((p) => p.category.slug === slug);
      if (productsInCategory.length === 1) {
        router.push(`/produtos/${productsInCategory[0].slug}${locale === "pt" ? "" : `?idioma=${locale}`}`);
        return;
      }
    }

    const next = new URLSearchParams(params.toString());
    if (slug) next.set("categoria", slug);
    else next.delete("categoria");
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  }

  // `sort_order` is the brand's own order, alphabetical by the Portuguese name.
  // Sorting by the *translated* name instead put the filters — and therefore the
  // products under them — in a different order in each language, so the English
  // page was laid out differently from the Portuguese one for no reason a
  // visitor could see.
  const sorted = useMemo(() => [...categories].sort((a, b) => a.sort_order - b.sort_order), [categories]);

  // One flat grid: grouping by category left seven single-product rows mostly empty.
  // Products stay ordered by category so related items still sit together.
  const visible = useMemo(() => {
    const order = new Map(sorted.map((c, i) => [c.slug, i]));
    const list = active ? products.filter((p) => p.category.slug === active) : [...products];
    return list.sort(
      (a, b) =>
        (order.get(a.category.slug) ?? 0) - (order.get(b.category.slug) ?? 0) || a.sort_order - b.sort_order,
    );
  }, [active, products, sorted]);

  const options = useMemo(
    () => [
      { key: "", label: t.products.allCategories },
      ...sorted.map((c) => ({ key: c.slug, label: getCategoryName(c.slug, locale, c.name) })),
    ],
    [sorted, locale, t],
  );

  return (
    <>
      <div className="sticky top-[72px] z-30 -mx-5 mt-10 bg-ivory/95 px-5 py-3 backdrop-blur-sm md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
        <FilterBar
          ariaLabel={t.products.filterLabel}
          options={options}
          activeKey={active ?? ""}
          onSelect={select}
          labels={{ previous: t.products.scrollLeft, next: t.products.scrollRight }}
        />
      </div>

      <div ref={gridRef} className="mt-10" aria-live="polite">
        {visible.length === 0 ? (
          <div className="card-brand flex items-center gap-4 p-6 text-ink/80">
            <Crescent size={18} tone="var(--violet)" />
            <p>{t.products.emptyCategory}</p>
          </div>
        ) : (
          <>
            {/*
              Sighted visitors read the selected filter pill and know what this
              grid is. Someone moving through the page by heading jumped from
              "os nossos produtos" straight into product names, with nothing in
              between to say which set they were in — so the filter, which is
              the whole point of the page, was invisible to them. Off-screen, so
              nothing changes visually.
            */}
            <h2 className="sr-only">{options.find((o) => o.key === (active ?? ""))?.label ?? t.products.allCategories}</h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={i < 4} locale={locale} showStory={false} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <Modal open={cancelled} onClose={() => setCancelled(false)} title={t.cart.errorTitle} primaryLabel={t.cart.ok}>
        {t.cart.cancelled}
      </Modal>
    </>
  );
}
