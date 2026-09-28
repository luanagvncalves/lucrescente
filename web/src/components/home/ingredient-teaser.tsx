import Link from "next/link";
import type { Ingredient } from "@/lib/types";
import { Reveal } from "@/components/ui/reveal";
import { getIngredientCategoryName, getIngredientCopy } from "@/content/ingredient-locales";
import type { ProductLocale } from "@/content/product-locales";

/**
 * The eight ingredients teased on the home page. It used to show four behind a
 * "ver mais" toggle; the whole set is short enough to stand on the page, and
 * the link above the grid is what carries a visitor to the rest. With nothing
 * to expand, the component needs no client state — it renders on the server.
 */
export function IngredientTeaserGrid({ items, locale = "pt" }: { items: Ingredient[]; locale?: ProductLocale }) {
  return (
    <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((i, index) => (
        // the delay restarts at the top of each row of four, so the second row
        // arrives in the same rhythm as the first
        <Reveal as="li" key={i.slug} delay={(index % 4) * 0.08}>
          <Link
            href={`/ingredientes/${i.slug}${locale === "pt" ? "" : `?idioma=${locale}`}`}
            className="card-brand block h-full p-5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            {i.category !== "Óleos Vegetais" ? <p className="label-brand text-violet">{getIngredientCategoryName(i.category, locale, i.category)}</p> : null}
            {(() => {
              const copy = getIngredientCopy(i.slug, locale, {
                name: i.name,
                origin: i.origin,
                properties: i.properties,
                applications: i.applications,
              });
              return (
                <>
                  {/* no `lowercase` here: the name arrives brand-cased, which keeps the E of vitamina E */}
                  <p className={`font-display text-[1.3rem] leading-tight text-forest ${i.category !== "Óleos Vegetais" ? "mt-2" : ""}`}>
                    {copy.name}
                  </p>
                  {i.scientific_name ? <p className="mt-1 text-[0.85rem] italic text-ink/70">{i.scientific_name}</p> : null}
                  {copy.properties ? (
                    <p className="mt-3 line-clamp-2 text-[0.85rem] leading-relaxed text-ink/75">{copy.properties}</p>
                  ) : null}
                </>
              );
            })()}
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
