"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { t } from "@/lib/i18n";
import type { Ingredient } from "@/lib/types";
import { Crescent } from "@/components/ui/motifs";
import { FilterBar } from "@/components/ui/filter-bar";

function slugifyCat(c: string) {
  return c
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function IngredientIndex({ ingredients }: { ingredients: Ingredient[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeSlug = params.get("categoria");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of ingredients) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
    return [...counts.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "pt"))
      .map(([name, count]) => ({ name, slug: slugifyCat(name), count }));
  }, [ingredients]);

  const active = categories.find((c) => c.slug === activeSlug)?.name ?? null;

  const options = useMemo(
    () => [
      { key: "", label: t.ingredients.allCategories, count: ingredients.length },
      ...categories.map((c) => ({ key: c.slug, label: c.name, count: c.count })),
    ],
    [categories, ingredients.length],
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
      ingredients.filter(
        (i) => (!active || i.category === active) && (!q || i.name.toLowerCase().includes(q) || (i.scientific_name ?? "").toLowerCase().includes(q)),
      ),
    [ingredients, active, q],
  );

  const groups = categories.map(({ name }) => ({ name, items: visible.filter((i) => i.category === name) })).filter((g) => g.items.length);

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
          <section key={g.name} aria-labelledby={`ing-${slugifyCat(g.name)}`}>
            <div className="mb-6 flex items-baseline gap-4">
              <h2 id={`ing-${slugifyCat(g.name)}`} className="text-h3 text-forest lowercase md:text-[2rem]">
                {g.name}
              </h2>
              <span className="text-[0.85rem] text-ink/60">{g.items.length}</span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {g.items.map((i) => (
                <li key={i.slug}>
                  <Link href={`/ingredientes/${i.slug}`} className="card-brand group flex h-full flex-col p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                    <p className="label-brand text-violet">{i.category}</p>
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
