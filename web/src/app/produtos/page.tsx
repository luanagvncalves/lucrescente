import type { Metadata } from "next";
import { Suspense } from "react";
import { t } from "@/lib/i18n";
import { getCategories, getProducts } from "@/lib/catalog";
import { SectionHeader, H1 } from "@/components/ui/typography";
import { Catalogue } from "@/components/product/catalogue";

export const revalidate = 60;

export const metadata: Metadata = {
  title: t.products.title,
  description: t.home.productsSubtitle,
  alternates: { canonical: "/produtos" },
};

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <div className="container-brand pt-10 pb-8 md:pt-16">
      <SectionHeader as={H1} label={t.products.label} title={t.products.title} subtitle={t.home.productsSubtitle} />
      <Suspense fallback={null}>
        <Catalogue categories={categories} products={products} />
      </Suspense>
    </div>
  );
}
