import type { Metadata } from "next";
import { Suspense } from "react";
import { t } from "@/lib/i18n";
import { getIngredients } from "@/lib/catalog";
import { H1, SectionHeader } from "@/components/ui/typography";
import { IngredientIndex } from "@/components/ingredient/ingredient-index";

export const revalidate = 300;

export const metadata: Metadata = {
  title: t.ingredients.title,
  description: t.ingredients.subtitle,
  alternates: { canonical: "/ingredientes" },
};

export default async function IngredientsPage() {
  const ingredients = await getIngredients();
  return (
    <div className="container-brand pt-10 pb-8 md:pt-16">
      <SectionHeader as={H1} label={t.ingredients.label} title={t.ingredients.title} subtitle={t.ingredients.subtitle} tone="violet" />
      <Suspense fallback={null}>
        <IngredientIndex ingredients={ingredients} />
      </Suspense>
    </div>
  );
}
