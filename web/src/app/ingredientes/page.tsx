import type { Metadata } from "next";
import { Suspense } from "react";
import { t, getDictionary } from "@/lib/i18n";
import { getIngredients } from "@/lib/catalog";
import { getIngredientCategoryName, getIngredientCopy } from "@/content/ingredient-locales";
import type { ProductLocale } from "@/content/product-locales";
import { H1, SectionHeader } from "@/components/ui/typography";
import { IngredientIndex } from "@/components/ingredient/ingredient-index";

export const revalidate = 300;

export const metadata: Metadata = {
  title: t.ingredients.title,
  description: t.ingredients.subtitle,
  alternates: { canonical: "/ingredientes" },
};

export default async function IngredientsPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const dict = getDictionary(locale);
  const ingredients = await getIngredients();

  const items = ingredients.map((i) => {
    const copy = getIngredientCopy(i.slug, locale, i);
    return {
      slug: i.slug,
      name: copy.name,
      origin: copy.origin,
      scientific_name: i.scientific_name,
      category: i.category,
      categoryLabel: getIngredientCategoryName(i.category, locale, i.category),
    };
  });

  return (
    <div className="container-brand pt-10 pb-8 md:pt-16">
      <SectionHeader as={H1} label={dict.ingredients.label} title={dict.ingredients.title} subtitle={dict.ingredients.subtitle} tone="violet" />
      <Suspense fallback={null}>
        <IngredientIndex items={items} locale={locale} />
      </Suspense>
    </div>
  );
}
