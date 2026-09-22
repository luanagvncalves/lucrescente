"use client";

import { useState } from "react";
import Link from "next/link";
import type { Ingredient } from "@/lib/types";
import { getIngredientCategoryName, getIngredientCopy } from "@/content/ingredient-locales";
import type { ProductLocale } from "@/content/product-locales";

const INITIAL_COUNT = 4;

export function IngredientTeaserGrid({
  items,
  showMoreLabel,
  showLessLabel,
  locale = "pt",
}: {
  items: Ingredient[];
  showMoreLabel: string;
  showLessLabel: string;
  locale?: ProductLocale;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, INITIAL_COUNT);
  const hasMore = items.length > INITIAL_COUNT;

  return (
    <>
      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {visible.map((i) => (
          <li key={i.slug}>
            <Link href={`/ingredientes/${i.slug}`} className="card-brand block h-full p-5 transition-transform duration-200 hover:-translate-y-0.5">
              {i.category !== "Óleos Vegetais" ? <p className="label-brand text-violet">{getIngredientCategoryName(i.category, locale, i.category)}</p> : null}
              <p className={`font-display text-[1.3rem] leading-tight text-forest lowercase ${i.category !== "Óleos Vegetais" ? "mt-2" : ""}`}>
                {getIngredientCopy(i.slug, locale, { name: i.name, origin: "", properties: "", applications: "" }).name}
              </p>
              {i.scientific_name ? <p className="mt-1 text-[0.85rem] italic text-ink/70">{i.scientific_name}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
      {hasMore ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="label-brand text-moss underline underline-offset-4 hover:text-forest"
          >
            {expanded ? showLessLabel : `${showMoreLabel} →`}
          </button>
        </div>
      ) : null}
    </>
  );
}
