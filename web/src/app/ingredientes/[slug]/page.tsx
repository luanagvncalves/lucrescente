import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { getIngredientBySlug, getIngredients, getProductsForIngredient } from "@/lib/catalog";
import { getIngredientCategoryName, getIngredientCopy } from "@/content/ingredient-locales";
import { brandCase } from "@/lib/brand-case";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { Label } from "@/components/ui/typography";
import { ProductImage } from "@/components/ui/product-image";
import { alphabetical } from "@/lib/alphabetical";
import { ingredientIdentity } from "@/content/ingredient-identity";

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
  const name = brandCase(i.name);
  const origin = ingredientIdentity[slug]?.origin.pt ?? "país de produção por confirmar";
  return { title: name, description: origin, alternates: { canonical: `/ingredientes/${i.slug}` }, openGraph: { title: `${name} · lucrescente`, description: origin } };
}
export default async function IngredientPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const dict = getDictionary(locale);
  const ingredient = await getIngredientBySlug(slug);
  if (!ingredient) notFound();
  const products = alphabetical(await getProductsForIngredient(slug), (p) => getProductCopy(p.slug, locale, { name: p.name }).name, locale);
  const s = dict.ingredients.sections;
  const copy = getIngredientCopy(slug, locale, ingredient);
  const scientificName = (ingredient.scientific_name ?? "")
    .replace("(folhas e ramos)", locale === "en" ? "(leaves and twigs)" : locale === "fr" ? "(feuilles et rameaux)" : "(folhas e ramos)")
    .replace("(soja)", locale === "en" ? "(soy)" : "(soja)")
    .replace("(sementes)", locale === "en" ? "(seeds)" : locale === "fr" ? "(graines)" : "(sementes)")
    .trim().replace(/[.]+$/, "");
  const categoryLabel = getIngredientCategoryName(ingredient.category, locale, ingredient.category);
  const query = locale === "pt" ? "" : `?idioma=${locale}`;
  const identity = ingredientIdentity[slug];
  const originText = identity?.origin[locale] ?? ({ pt: "país de produção por confirmar", en: "country of production to be confirmed", fr: "pays de production à confirmer" }[locale]);
  const inciText = identity?.inci || ({ pt: "designação por confirmar", en: "name to be confirmed", fr: "dénomination à confirmer" }[locale]);
  const sections: { id: string; title: string; text: string | null }[] = [
    { id: "sec-propriedades", title: s.properties, text: copy.properties },
    { id: "sec-aplicacoes", title: s.applications, text: copy.applications },
  ];
  return (
    <article className="container-brand pt-8 md:pt-12">
      <nav aria-label={dict.nav.breadcrumb} className="text-[0.85rem] text-ink/70">
        <Link href={`/ingredientes${query}`} className="inline-flex min-h-11 items-center hover:underline underline-offset-4">{dict.nav.ingredients}</Link>
        <span className="mx-2">/</span><span className="lowercase">{categoryLabel}</span>
      </nav>
      <header className="mt-4">
        <Label tone="violet">{categoryLabel}</Label>
        <h1 className="mt-3 text-h2 text-forest">{copy.name}</h1>
        {scientificName ? <p className="mt-3 font-display text-[1.5rem] italic text-clay">{scientificName}</p> : null}
      </header>
      <div className="mt-8 grid divide-y divide-forest/20 border-y border-forest/20 md:grid-cols-3 md:divide-x md:divide-y-0">
        <section aria-label={s.origin + " / INCI"} className="py-5 md:pr-6">
          <div aria-labelledby="sec-origem">
            <h2 id="sec-origem" className="text-h3 text-forest lowercase">{s.origin}</h2>
            <p className="mt-2 text-[1rem] leading-relaxed text-ink/85">{originText}</p>
          </div>
          <div aria-labelledby="sec-inci" className="mt-5">
            <h2 id="sec-inci" className="text-h3 text-forest">INCI</h2>
            <p className="mt-2 break-words text-[1rem] leading-relaxed text-ink/85">{inciText}</p>
          </div>
        </section>
        {sections.filter((sec) => sec.text).map((sec) => (
          <section key={sec.id} aria-labelledby={sec.id} className="py-5 md:px-6 md:first:pl-0 md:last:pr-0">
            <h2 id={sec.id} className="text-h3 text-forest lowercase">{sec.title}</h2>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink/85">{sec.text}</p>
          </section>
        ))}
      </div>
      {products.length ? (
        <section aria-labelledby="usados" className="mt-8">
          <h2 id="usados" className="text-h3 text-forest lowercase">{dict.products.usedInTitle}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => {
              const name = getProductCopy(product.slug, locale, { name: product.name }).name;
              return (
                <li key={product.slug} className="max-w-[260px]">
                  <Link href={`/produtos/${product.slug}${query}`} className="group block focus-visible:outline-offset-4">
                    <ProductImage image={product.images[0]} ratio="square" fallbackLabel={name} locale={locale} sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw" />
                    <div className="mt-3 flex items-start justify-between gap-3 text-forest">
                      <h3 className="font-display text-[1.25rem] leading-tight lowercase group-hover:underline underline-offset-4">{name}</h3>
                      <span aria-hidden="true" className="text-moss">→</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
      <Link href={`/ingredientes${query}`} className="mt-6 inline-flex min-h-11 items-center font-ui text-[0.92rem] font-medium text-moss hover:underline underline-offset-4">{dict.ingredients.backToIndex}</Link>
    </article>
  );
}
