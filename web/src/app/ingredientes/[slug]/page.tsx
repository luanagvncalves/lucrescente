import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { getIngredientBySlug, getIngredients, getProductsForIngredient } from "@/lib/catalog";
import { getIngredientCategoryName, getIngredientCopy } from "@/content/ingredient-locales";
import { brandCase, brandSentence } from "@/lib/brand-case";
import type { ProductLocale } from "@/content/product-locales";
import { Label } from "@/components/ui/typography";
import { Pause } from "@/components/ui/motifs";
import { ProductCard } from "@/components/product/product-card";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<{ idioma?: string }> };

export async function generateStaticParams() {
  const list = await getIngredients();
  return list.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const i = await getIngredientBySlug(slug);
  if (!i) return {};
  // The database stores these title-cased ("Óleo de Coco"). A tab title and a
  // search result are the one place CSS cannot put them into the brand's
  // lowercase, so it has to happen here.
  const name = brandCase(i.name);
  const origin = brandSentence(i.origin ?? "");
  return {
    title: name,
    description: origin,
    alternates: { canonical: `/ingredientes/${i.slug}` },
    openGraph: { title: `${name} · lucrescente`, description: origin },
  };
}

export default async function IngredientPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const dict = getDictionary(locale);
  const ingredient = await getIngredientBySlug(slug);
  if (!ingredient) notFound();
  const products = await getProductsForIngredient(slug);
  const s = dict.ingredients.sections;

  const copy = getIngredientCopy(slug, locale, ingredient);
  const categoryLabel = getIngredientCategoryName(ingredient.category, locale, ingredient.category);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  const sections: { title: string; text: string | null }[] = [
    { title: s.scientificName, text: ingredient.scientific_name },
    { title: s.origin, text: copy.origin },
    { title: s.properties, text: copy.properties },
    { title: s.applications, text: copy.applications },
  ];

  return (
    <article className="container-brand pt-8 md:pt-12">
      <nav aria-label="caminho" className="text-[0.85rem] text-ink/70">
        <Link href={`/ingredientes${query}`} className="hover:underline underline-offset-4">
          {dict.nav.ingredients}
        </Link>
        <span className="mx-2">/</span>
        <span className="lowercase">{categoryLabel}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <Label tone="violet">{categoryLabel}</Label>
        {/* no `lowercase` here: the name arrives brand-cased, which keeps the E of vitamina E */}
        <h1 className="mt-3 text-h1 text-forest">{copy.name}</h1>
        {ingredient.scientific_name ? <p className="mt-3 font-display text-[1.5rem] italic text-clay">{ingredient.scientific_name}</p> : null}
      </header>

      <div className="mt-12 grid gap-10 md:grid-cols-12">
        <div className="space-y-10 md:col-span-7">
          {sections
            .filter((sec) => sec.text)
            .map((sec) => (
              <section key={sec.title} aria-labelledby={`sec-${sec.title}`}>
                <h2 id={`sec-${sec.title}`} className="text-h3 text-forest lowercase">
                  {sec.title}
                </h2>
                <p className="mt-3 text-body-lg measure">{sec.text}</p>
              </section>
            ))}
        </div>
        <aside className="md:col-span-4 md:col-start-9">
          <div className="card-brand p-6">
            <p className="label-brand text-moss">{dict.ingredients.productsUsing}</p>
            {products.length ? (
              <ul className="mt-4 space-y-2">
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/produtos/${p.slug}`} className="inline-flex min-h-11 items-center font-display text-[1.2rem] leading-tight text-forest lowercase hover:underline underline-offset-4">
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[0.92rem] text-ink/70">{dict.ingredients.noProducts}</p>
            )}
          </div>
          <Link href={`/ingredientes${query}`} className="mt-6 inline-flex min-h-11 items-center font-ui text-[0.92rem] font-medium text-moss hover:underline underline-offset-4">
            {dict.ingredients.backToIndex}
          </Link>
        </aside>
      </div>

      {products.length ? (
        <>
          <Pause className="my-16" />
          <section aria-labelledby="usados">
            <h2 id="usados" className="text-h2 text-forest lowercase">
              {dict.products.usedInTitle}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 8).map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </article>
  );
}
