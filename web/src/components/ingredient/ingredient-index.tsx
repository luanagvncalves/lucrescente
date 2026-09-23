"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import type { ProductLocale } from "@/content/product-locales";
import { Crescent } from "@/components/ui/motifs";
import { FilterBar } from "@/components/ui/filter-bar";

/** `category` stays Portuguese so the ?categoria= links survive a language change; `categoryLabel` is what we show. */
export type IngredientListItem = {
  slug: string;
  name: string;
  origin: string;
  scientific_name: string | null;
  category: string;
  categoryLabel: string;
};

function slugifyCat(c: string) {
  return c
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function IngredientIndex({ items, locale }: { items: IngredientListItem[]; locale: ProductLocale }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeSlug = params.get("categoria");
  const [query, setQuery] = useState("");
  const t = getDictionary(locale);

  const categories = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const i of items) {
      const entry = map.get(i.category);
      if (entry) entry.count++;
      else map.set(i.category, { label: i.categoryLabel, count: 1 });
    }
    return [...map.entries()]
      .map(([category, v]) => ({ category, slug: slugifyCat(category), label: v.label, count: v.count }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [items, locale]);

  const active = categories.find((c) => c.slug === activeSlug)?.category ?? null;

  const options = useMemo(
    () => [{ key: "", label: t.ingredients.allCategories, count: items.length }, ...categories.map((c) => ({ key: c.slug, label: c.label, count: c.count }))],
    [categories, items.length, t],
  );

  function select(slug: string) {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set("categoria", slug);
    else next.delete("categoria");
    router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false });
  }

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      items.filter(
        (i) => (!active || i.category === active) && (!q || i.name.toLowerCase().includes(q) || (i.scientific_name ?? "").toLowerCase().includes(q)),
      ),
    [items, active, q],
  );

  const groups = categories
    .map((c) => ({ ...c, items: visible.filter((i) => i.category === c.category) }))
    .filter((g) => g.items.length);

  const href = (slug: string) => (locale === "pt" ? `/ingredientes/${slug}` : `/ingredientes/${slug}?idioma=${locale}`);

  return (
    <>
      <div className="sticky top-[72px] z-30 -mx-5 mt-10 bg-ivory/95 px-5 py-3 backdrop-blur-sm md:-mx-8 md:px-8 lg:-mx-16 lg:px-16">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <FilterBar
            ariaLabel={t.products.filterLabel}
            options={options}
            activeKey={activeSlug ?? ""}
            onSelect={select}
            labels={{ previous: t.products.scrollLeft, next: t.products.scrollRight }}
          />

          <label className="relative block lg:w-72 lg:shrink-0">
            <span className="sr-only">{t.ingredients.searchPlaceholder}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.ingredients.searchPlaceholder}
              className="h-11 w-full rounded-full border border-moss/40 bg-paper px-5 font-ui text-[0.92rem] text-ink placeholder:text-ink/50 focus-visible:border-forest focus-visible:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-16" aria-live="polite">
        {groups.length === 0 ? (
          <div className="card-brand flex items-center gap-4 p-6 text-ink/80">
            <Crescent size={18} tone="var(--violet)" />
            <p>{t.ingredients.noResults}</p>
          </div>
        ) : null}
        {groups.map((g) => (
          <section key={g.category} aria-labelledby={`ing-${g.slug}`}>
            <div className="mb-6 flex items-baseline gap-4">
              <h2 id={`ing-${g.slug}`} className="text-h3 text-forest lowercase md:text-[2rem]">
                {g.label}
              </h2>
              <span className="text-[0.85rem] text-ink/60">{g.items.length}</span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {g.items.map((i) => (
                <li key={i.slug}>
                  <Link href={href(i.slug)} className="card-brand group flex h-full flex-col p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                    <p className="label-brand text-violet">{i.categoryLabel}</p>
                    <h3 className="mt-3 font-display text-[1.4rem] leading-tight text-forest lowercase">{i.name}</h3>
                    {i.scientific_name ? <p className="mt-1 text-[0.88rem] italic text-ink/70">{i.scientific_name}</p> : null}
                    <p className="mt-4 line-clamp-3 text-[0.9rem] leading-relaxed text-ink/80">{i.origin}</p>
                    <span className="mt-auto pt-4 font-ui text-[0.88rem] font-medium text-moss">{t.home.cardLink}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
