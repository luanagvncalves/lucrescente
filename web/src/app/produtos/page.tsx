import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary, t } from "@/lib/i18n";
import { getCategories, getProducts } from "@/lib/catalog";
import type { ProductLocale } from "@/content/product-locales";
import { SectionHeader, H1 } from "@/components/ui/typography";
import { Catalogue } from "@/components/product/catalogue";

export const revalidate = 60;

export const metadata: Metadata = {
  title: t.products.title,
  description: t.home.productsSubtitle,
  alternates: { canonical: "/produtos" },
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const d = getDictionary(locale);
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div className="container-brand pt-10 pb-8 md:pt-16">
      <SectionHeader as={H1} label={d.products.label} title={d.products.title} subtitle={d.home.productsSubtitle} />
      <Suspense fallback={null}>
        <Catalogue categories={categories} products={products} />
      </Suspense>
    </div>
  );
}
