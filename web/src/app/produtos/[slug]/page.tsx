import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { getProductCopy, type ProductLocale } from "@/content/product-locales";
import { getCategoryName } from "@/content/category-locales";
import { getIngredientName } from "@/content/ingredient-locales";
import { productAvailability } from "@/lib/types";
import { Label } from "@/components/ui/typography";
import { Pause } from "@/components/ui/motifs";
import { ProductImage } from "@/components/ui/product-image";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { RelatedCarousel } from "@/components/product/related-carousel";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductContact } from "@/components/product/product-contact";
import { WaterSavingInfo } from "@/components/product/water-saving-info";
import { ReusablePackagingInfo } from "@/components/product/reusable-packaging-info";
import { SkinSafeInfo } from "@/components/product/skin-safe-info";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<{ idioma?: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const description = p.why_it_works ? p.why_it_works.split(/(?<=\.)\s/)[0] : `${p.name} · ${p.category.name} · lucrescente`;
  return {
    title: p.name,
    description,
    alternates: { canonical: `/produtos/${p.slug}` },
    openGraph: {
      title: `${p.name} · lucrescente`,
      description,
      type: "website",
      images: p.images[0] ? [{ url: p.images[0].path, alt: p.images[0].alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { idioma } = await searchParams;
  const locale: ProductLocale = idioma === "en" || idioma === "fr" ? idioma : "pt";
  const t = getDictionary(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const avail = productAvailability(product);
  const copy = getProductCopy(product.slug, locale, { name: product.name, whyItWorks: product.why_it_works ?? undefined });
  const categoryName = getCategoryName(product.category.slug, locale, product.category.name);
  // keep the Portuguese story when a translation is missing, rather than dropping the section
  const whyItWorks = copy.whyItWorks ?? product.why_it_works;
  const query = locale === "pt" ? "" : `?idioma=${locale}`;

  // "cria o teu conjunto": same category first, then the rest of the catalogue.
  const all = await getProducts();
  const related = all
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => {
      const sameA = a.category.slug === product.category.slug ? 0 : 1;
      const sameB = b.category.slug === product.category.slug ? 0 : 1;
      // it is a carousel of photographs, so the ones without a photo go last
      const photoA = a.images.length ? 0 : 1;
      const photoB = b.images.length ? 0 : 1;
      return sameA - sameB || photoA - photoB || a.sort_order - b.sort_order;
    })
    .slice(0, 12);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Product schema with real prices only. On-request products get no offer.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.why_it_works ?? undefined,
    image: product.images.map((i) => `${siteUrl}${i.path}`),
    brand: { "@type": "Brand", name: "lucrescente" },
    category: product.category.name,
    ...(avail.kind !== "on-request"
      ? {
          offers: product.variants
            .filter((v) => v.price_cents !== null)
            .map((v) => ({
              "@type": "Offer",
              sku: v.sku,
              priceCurrency: "EUR",
              price: ((v.price_cents as number) / 100).toFixed(2),
              availability: v.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `${siteUrl}/produtos/${product.slug}`,
            })),
        }
      : {}),
  };

  return (
    <article className="container-brand pt-8 md:pt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="caminho" className="text-[0.85rem] text-ink/70">
        <Link href={`/produtos${query}`} className="hover:underline underline-offset-4">
          {t.nav.products}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/produtos?categoria=${product.category.slug}${locale === "pt" ? "" : `&idioma=${locale}`}`}
          className="hover:underline underline-offset-4"
        >
          {categoryName}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-12 lg:gap-14">
        {/* image 7 cols */}
        <div className="md:col-span-7">
          {product.images.length > 1 ? (
            <ProductGallery images={product.images} name={copy.name} />
          ) : (
            <ProductImage image={product.images[0] ?? null} ratio="portrait" priority sizes="(min-width: 768px) 58vw, 100vw" fallbackLabel={copy.name} className="frame-brand max-h-[80vh]" />
          )}
        </div>

        {/* copy 5 cols */}
        <div className="md:col-span-5">
          <Label>{categoryName}</Label>
          <h1 className="mt-3 text-h1 text-forest lowercase">{copy.name}</h1>

          {product.is_deodorant ? <p className="mt-5 text-[0.95rem] text-ink/80">{t.products.deodorantFact}</p> : null}
          {product.is_solid ? <p className="mt-5 text-[0.95rem] text-ink/80">{t.products.solidNote}</p> : null}

          <div className="mt-8">
            <PurchasePanel product={product} locale={locale} />
          </div>

          {product.is_deodorant ? (
            <ProductFeatures
              features={[
                { label: t.productInfo.notAntiperspirant },
                { label: t.productInfo.aluminiumFree },
                { label: t.productInfo.alcoholFree },
                { label: t.productInfo.customisable },
              ]}
            />
          ) : null}

          {product.is_candle ? <p className="mt-6 rounded-2xl bg-lavender/30 px-5 py-4 text-[0.92rem] leading-relaxed">{t.products.candleNote}</p> : null}
        </div>
      </div>

      <Pause className="my-16" />

      <div className="grid gap-12 md:grid-cols-12">
        {whyItWorks ? (
          <section className="md:col-span-7" aria-labelledby="porque">
            <Label>{t.products.whyItWorks}</Label>
            <p id="porque" className="mt-5 text-body-lg measure">
              {whyItWorks}
            </p>
          </section>
        ) : null}

        <section className={whyItWorks ? "md:col-span-4 md:col-start-9" : "md:col-span-7"} aria-labelledby="ingredientes-principais">
          <Label>{t.products.mainIngredients}</Label>
          {product.ingredients.length ? (
            <ul id="ingredientes-principais" className="mt-5 flex flex-wrap gap-2">
              {product.ingredients.map((i) => (
                <li key={i.slug}>
                  <Link
                    href={`/ingredientes/${i.slug}${query}`}
                    className="inline-flex min-h-11 items-center rounded-full border border-moss/40 bg-paper px-4 py-2 font-ui text-[0.9rem] font-medium text-forest transition-colors hover:border-forest hover:bg-forest hover:text-white"
                  >
                    {getIngredientName(i.slug, locale, i.name)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p id="ingredientes-principais" className="mt-5 text-[0.95rem] text-ink/70">
              {t.products.noIngredientsListed}
            </p>
          )}
        </section>
      </div>

      <WaterSavingInfo product={product} locale={locale} />
      <ReusablePackagingInfo product={product} locale={locale} />
      <SkinSafeInfo product={product} locale={locale} />

      <RelatedCarousel items={related} locale={locale} />

      <ProductContact productName={copy.name} locale={locale} />
    </article>
  );
}
